import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must have at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email must have at most 45 character(s)' }),
  // NB In the backend, password is set to max at 100 b/c password will be encrypted in the backend, resulting in
  //  longer form, however, not the case for frontend
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character requirement' }),
});

export default loginSchema;
