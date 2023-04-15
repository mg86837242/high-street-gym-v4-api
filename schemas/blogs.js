import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().trim().max(45),
  body: z.string().max(6000),
  loginId: z.number(),
});

export default blogSchema;
