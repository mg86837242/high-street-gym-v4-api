import { z } from 'zod';
import { idSchema } from './params';

export const blogSchema = z.object({
  title: z.string().trim().max(45),
  body: z.string().max(6000),
  loginId: z.number(),
});

export const updateBlogSchema = z.object({
  params: z.object({ id: idSchema }),
  body: blogSchema,
});
