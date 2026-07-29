import mongoose from "mongoose";
import { Loyalty } from "./loyalty.model";
import { User } from "../user/user.model";
import { Order } from "../order/order.model";
import { EOrderStatus } from "../order/order.interface";

const earnPoints = async (orderId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== EOrderStatus.DELIVERED) {
      throw new Error(
        "Points can only be earned after delivery"
      );
    }

    /**
     * Prevent duplicate rewards
     */

    const alreadyRewarded = await Loyalty.findOne({
      order: order._id,
      type: "EARN",
    }).session(session);

    if (alreadyRewarded) {
      throw new Error("Points already awarded.");
    }

    /**
     * Business Rule
     *
     * 100 BDT = 1 point
     */

    const earnedPoints = Math.floor(
      order.totalPrice / 100
    );

    /**
     * Update user balance
     */

    await User.findByIdAndUpdate(
      order.userId,
      {
        $inc: {
          loyaltyPoints: earnedPoints,
        },
      },
      {
        session,
      }
    );

    /**
     * Save history
     */

    await Loyalty.create(
      [
        {
          user: order.userId,
          order: order._id,

          type: "EARN",

          points: earnedPoints,

          description: `Earned ${earnedPoints} points from Order #${order._id}`,

          expiresAt: new Date(
            Date.now() +
              365 * 24 * 60 * 60 * 1000
          ),
        },
      ],
      {
        session,
      }
    );

    await session.commitTransaction();

    return {
      success: true,
      earnedPoints,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const LoyaltyService = {
  earnPoints,
};