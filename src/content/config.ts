import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			published: z.coerce.date(), // 自动转换日期字符串为 Date 对象
			updated: z.coerce.date().optional(),
			draft: z.boolean().optional().default(false),
			description: z.string().optional().default(""),
			image: image().optional(),
			tags: z.preprocess(
				(val) => {
					if (Array.isArray(val)) return val;
					if (typeof val === "string") {
						// 如果是逗号分隔的字符串，转换为数组
						return val.trim() ? val.split(",").map(t => t.trim()).filter(Boolean) : [];
					}
					return [];
				},
				z.array(z.string())
			).optional().default([]),
			category: z.string().optional().nullable().default(""),
			lang: z.string().optional().default(""),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		}),
});
const specCollection = defineCollection({
	schema: ({ image }) => z.object({}).passthrough(),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
