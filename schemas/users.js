import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, { message: 'Email only accepts at least 1 character(s)' })
  .email()
  .max(45, { message: 'Email only accepts at most 45 character(s)' });
export const passwordSchema = z
  // NB Max length of password is set to 100 for server-side validation b/c encrypting password results in longer
  //  password
  .string()
  .min(8, { message: 'Password only accepts at least 8 character(s)' })
  .max(100, { message: 'Password exceeds maximum character allowance' });
export const usernameSchema = z
  .string()
  .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
    message: 'Username only accepts English letters and numbers, and must include at least 1 letter',
  })
  .max(45, { message: 'Username only accepts at most 45 character(s)' });
export const firstNameSchema = z
  .string()
  .min(1, { message: 'Name only accepts at least 1 character(s)' })
  .regex(/^[a-zA-Z]+$/, {
    message: 'Name only accepts English letters',
  })
  .max(45);
export const lastNameSchema = z
  .string()
  .min(1, { message: 'Name only accepts at least 1 character(s)' })
  .regex(/^[a-zA-Z]+$/, {
    message: 'Name only accepts English letters',
  })
  .max(45);
export const phoneSchema = z
  .string()
  .min(1, { message: 'Phone only accepts at least 1 character(s)' })
  .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
    message: 'Invalid phone number format',
  })
  .max(45);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
