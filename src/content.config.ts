import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The long-form write-up, rendered at /story.
// Its frontmatter also feeds the "At a glance" panel and page metadata.
const story = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/story' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        date: z.coerce.date(), // publish date of the write-up
        updated: z.coerce.date().optional(),
        status: z.enum(['complete', 'in progress', 'prototype']).optional(),
        event: z.string().optional(),
        eventDate: z.string().optional(), // free text, e.g. "October 2026, Australia"
        award: z.string().optional(),
        team: z.array(z.string()).default([]),
        role: z.string().optional(),
        duration: z.string().optional(),
        platform: z.string().optional(),
        tags: z.array(z.string()).default([]),
        stack: z.array(z.string()).default([]),
        links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
        linksNote: z.string().optional(), // shown when there are no links yet
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine((d) => !d.cover || d.coverAlt, {
        message: 'coverAlt is required when a cover image is set',
        path: ['coverAlt'],
      }),
});

export const collections = { story };
