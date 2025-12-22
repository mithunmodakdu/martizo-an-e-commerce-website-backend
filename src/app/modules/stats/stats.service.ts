import { Order } from "../order/order.model";
import { Product } from "../product/product.model";
import { EIsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUsersStats = async () => {
  const totalActiveUsersPromise = User.countDocuments({
    isActive: EIsActive.ACTIVE,
  });
  const totalInactiveUsersPromise = User.countDocuments({
    isActive: EIsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: EIsActive.BLOCKED,
  });

  const newTotalUsersInLastSevenDaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newTotalUsersInLastThirtyDaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalUsersByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newTotalUsersInLastSevenDays,
    newTotalUsersInLastThirtyDays,
    totalUsersByRole,
  ] = await Promise.all([
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newTotalUsersInLastSevenDaysPromise,
    newTotalUsersInLastThirtyDaysPromise,
    totalUsersByRolePromise,
  ]);

  return {
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newTotalUsersInLastSevenDays,
    newTotalUsersInLastThirtyDays,
    totalUsersByRole,
  };
};

const getProductsStats = async () => {
  const totalProductsPromise = Product.countDocuments();

  const totalProductsByCategoryPromise = Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },

    {
      $unwind: "$category",
    },

    {
      $group: {
        _id: "$category.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalProductsByBrandNamePromise = Product.aggregate([
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },

    {
      $unwind: "$brand",
    },

    {
      $group: {
        _id: "$brand.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestOrderedProductsPromise = Order.aggregate([
    // stage-1: break items array
    {
      $unwind: "$items",
    },

    // stage-2: group by productId
    {
      $group: {
        _id: "$items.productId",
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: "$items.quantity" },
      },
    },

    // stage-3: sort by orders number
    {
      $sort: { totalOrders: -1 },
    },

    // stage-4: limit top ordered products
    {
      $limit: 5,
    },

    // stage-5: lookup product details
    {
      $lookup: {
        from: "products",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$productId"] },
            },
          },
        ],
        as: "product",
      },
    },

    // stage-6: unwind product array
    {
      $unwind: "$product"
    },

    // stage-7: final shape
    {
      $project: {
        _id: 0,
        productId: "$_id",
        totalOrders: 1,
        totalQuantity: 1,
        "product.title": 1,
        "product.slug": 1
      }
    }
  ]);

  const averageProductsPricePromise = Product.aggregate([
    {
      $group: {
        _id: null,
        averageProductsPrice: { $avg: "$price" },
      },
    },
  ]);

  const [
    totalProducts,
    totalProductsByCategory,
    totalProductsByBrandName,
    totalHighestOrderedProducts,
    averageProductsPrice,
  ] = await Promise.all([
    totalProductsPromise,
    totalProductsByCategoryPromise,
    totalProductsByBrandNamePromise,
    totalHighestOrderedProductsPromise,
    averageProductsPricePromise,
  ]);

  return {
    totalProducts,
    totalProductsByCategory,
    totalProductsByBrandName,
    totalHighestOrderedProducts,
    averageProductsPrice,
  };
};

const getOrdersStats = async () => {
  return {};
};

const getPaymentsStats = async () => {
  return {};
};

export const StatsServices = {
  getUsersStats,
  getProductsStats,
  getOrdersStats,
  getPaymentsStats,
};
