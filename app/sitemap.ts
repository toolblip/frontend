import { MetadataRoute } from 'next'
import { tools } from '@/src/data/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolblip.com'

  const staticPages = [
    { url: baseUrl, lastmod: new Date().toISOString(), priority: 1 },
    { url: `${baseUrl}/tools`, lastmod: new Date().toISOString(), priority: 0.8 },
    { url: `${baseUrl}/directory`, lastmod: new Date().toISOString(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastmod: new Date().toISOString(), priority: 0.6 },
    { url: `${baseUrl}/login`, lastmod: new Date().toISOString(), priority: 0.4 },
    { url: `${baseUrl}/signup`, lastmod: new Date().toISOString(), priority: 0.4 },
    { url: `${baseUrl}/blog`, lastmod: new Date().toISOString(), priority: 0.7 },
  ]

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastmod: new Date().toISOString(),
    priority: 0.6,
  }))

  return [...staticPages, ...toolPages]
}