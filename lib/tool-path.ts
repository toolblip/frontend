import { getToolBySlug, tools, type Tool } from '@/data/tools';

export const IMAGE_CATEGORY = 'Image';
export const IMAGE_CATEGORY_PATH = '/tools/images';

export function getToolPath(tool: Pick<Tool, 'slug' | 'category'>): string {
  return tool.category === IMAGE_CATEGORY
    ? `${IMAGE_CATEGORY_PATH}/${tool.slug}`
    : `/tools/${tool.slug}`;
}

export function getToolPathBySlug(slug: string): string {
  const tool = getToolBySlug(slug);
  return tool ? getToolPath(tool) : `/tools/${slug}`;
}

export function getCategoryPath(category: string): string {
  return category === IMAGE_CATEGORY
    ? IMAGE_CATEGORY_PATH
    : `/tools?category=${encodeURIComponent(category)}`;
}

export function getImageTools(): Tool[] {
  return tools.filter((tool) => tool.category === IMAGE_CATEGORY);
}

export function isImageToolSlug(slug: string): boolean {
  return getToolBySlug(slug)?.category === IMAGE_CATEGORY;
}

export function getToolAbsoluteUrl(tool: Pick<Tool, 'slug' | 'category'>): string {
  return `https://toolblip.com${getToolPath(tool)}`;
}
