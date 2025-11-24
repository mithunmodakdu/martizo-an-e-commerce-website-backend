import { Types } from "mongoose";
import { IVariant } from "../variant/variant.interface";

export interface IProduct {
  _id: string;

  // main details
  title: string;
  slug: string;
  description: string;

  // categorization
  category: Types.ObjectId;
  subCategory?: string;
  brand?: string;

  // pricing
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  
  // stock + variants
  stock: number;
  variants: IVariant[];

  // media
  thumbnail: string;
  images: string[];

  // labels for Shop menu sections
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  isTrending?: boolean;
  isMartizoExclusive?: boolean;

  // offers
  offers?: [Types.ObjectId];

  // rating system
  rating?: number;
  ratingCount?: number;

  // others
  sku?: string;
  status: "ACTIVE" | "INACTIVE"; 

}