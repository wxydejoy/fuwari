import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/posts",
	}),
	schema: z.object({
		title: z.string(),
		published: z.coerce.date(),
		updated: z.coerce.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z
			.union([z.string(), z.null()])
			.optional()
			.transform((value) => value || undefined),
		tags: z
			.union([z.array(z.string()), z.string()])
			.transform((val) => {
				if (Array.isArray(val)) return val;
				return val
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean);
			})
			.optional()
			.default([]),
		category: z
			.union([z.string(), z.null()])
			.optional()
			.transform((value) => value ?? ""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/spec",
	}),
	schema: z.looseObject({}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
