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
    .min(8, { message: 'Email must have at least 8 character(s)' })
    .max(100, { message: 'Email must have at most 100 character(s)' }),
  // .regex(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/, {
  //     message:
  //     'Password must be 6 characters minimum, with at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces',
  // }),
  // username: z
  //   .string()
  //   .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
  //     message: 'Username only accepts letters and numbers, and must include at least 1 letter at the moment',
  //   })
  //   .max(45),
});

export default loginSchema;
