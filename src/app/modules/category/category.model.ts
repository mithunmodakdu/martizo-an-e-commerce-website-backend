import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";

export const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String},
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    icon: String,
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-category`;

    let counter = 1;

    while (await Category.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }

  next();
});

export const Category = model("Category", categorySchema);
