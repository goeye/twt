import { banners } from "./banners";
import { categories } from "./categories";
import { resources } from "./resources";
import type {
  Category,
  Banner,
  ResourceCard,
  ResourceDetail,
} from "../types";

export async function fetchBanners(): Promise<Banner[]> {
  return banners.sort((a, b) => a.order - b.order);
}

export async function fetchCategories(): Promise<Category[]> {
  return categories.sort((a, b) => a.order - b.order);
}

export async function fetchFeatured(): Promise<ResourceCard[]> {
  return resources
    .filter((r) => r.featured)
    .map(toCard);
}

export async function fetchResourcesByCategory(
  categoryId: number,
  subCategoryId?: number
): Promise<ResourceCard[]> {
  return resources
    .filter(
      (r) =>
        r.categoryId === categoryId &&
        (subCategoryId == null || r.subCategoryId === subCategoryId)
    )
    .map(toCard);
}

export async function fetchResourceBySlug(
  slug: string
): Promise<ResourceDetail | null> {
  return resources.find((r) => r.slug === slug) ?? null;
}

export async function fetchResourceById(
  id: number
): Promise<ResourceDetail | null> {
  return resources.find((r) => r.id === id) ?? null;
}

function toCard(r: ResourceDetail): ResourceCard {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    logo: r.logo,
    shortDesc: r.shortDesc,
    tags: r.tags,
    rating: r.rating,
    link: r.link,
    categoryId: r.categoryId,
    subCategoryId: r.subCategoryId,
  };
}
