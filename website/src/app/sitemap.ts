import type { MetadataRoute } from "next";
import { getSkills } from "@/lib/skills";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...getSkills().map((s) => ({
      url: `${SITE_URL}/skills/${s.name}/`,
      lastModified: s.updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
