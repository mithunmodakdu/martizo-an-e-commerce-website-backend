import { model, Schema } from "mongoose";
import { IBrand } from "./brand.interface";

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    isTopBrand: {type: Boolean, default: false},
    isMartizoChoice: {type: Boolean, default: false},
    brandLogo: {type: String}
  },
  {
    timestamps: true,
  }
);

BrandSchema.pre("save", async function(next){
  if(this.isModified("name")){
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-brand`;

    let counter = 1;
    while(await Brand.exists({slug})){
      slug = `${slug}-${counter++}`
    }

    this.slug = slug;
  }

  next();
});

export const Brand = model<IBrand>("Brand", BrandSchema);
