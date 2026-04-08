
export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  parent?: string | null;
  icon?: string;
}