
export interface IBrand {
  _id?: string;
  name: string;
  slug: string;
  tagline: string;
  brandLogo: string;
  isTopBrand?: boolean;
  isMartizoChoice?: boolean;
  isFeatured?: boolean;
}