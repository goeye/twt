export type ResourceTag = "推荐" | "TOP" | "NEW" | "优";

export type LinkBehavior =
  | { type: "external"; url: string }
  | { type: "detail"; slug: string };

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  order: number;
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
  subCategories: SubCategory[];
  order: number;
}

export interface ResourceDetail {
  id: number;
  slug: string;
  name: string;
  logo: string;
  shortDesc: string;
  fullDesc: string;
  tags: ResourceTag[];
  rating: number;
  link: LinkBehavior;
  screenshots: string[];
  featured: boolean;
  categoryId: number;
  subCategoryId?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export type ResourceCard = Pick<
  ResourceDetail,
  | "id"
  | "slug"
  | "name"
  | "logo"
  | "shortDesc"
  | "tags"
  | "rating"
  | "link"
  | "categoryId"
  | "subCategoryId"
>;
