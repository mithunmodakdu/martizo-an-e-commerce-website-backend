import { Types } from "mongoose";

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  parent?: Types.ObjectId | null;
  icon?: string;
}