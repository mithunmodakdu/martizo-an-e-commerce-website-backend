import { model, Schema } from "mongoose";
import { IOffer } from "./offer.interface";

const OfferSchema = new Schema<IOffer>(
  {
    offerType: {
      type: String,
      enum: ["TODAYS_OFFER", "CLEARANCE", "VOUCHER", "BUNDLE", "FLASH_SALE"],
      required: true,
    },
    discountPercentage: {type: Number},
    startDate: {type: Date},
    endDate: { type: Date},
    voucherCode: {type: String}
  },
  {
    timestamps: true,
  }
);

export const Offer = model<IOffer>("Offer", OfferSchema);
