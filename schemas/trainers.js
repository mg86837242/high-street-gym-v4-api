import { z } from 'zod';

export const trainerSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must have at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email must have at most 45 character(s)' }),
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character requirement' }),
  username: z
    .string()
    .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
      message: 'Username only accepts letters and numbers, and must include at least 1 letter at the moment',
    })
    .max(45),
  firstName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  lastName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  phone: z
    .string()
    .min(1, { message: 'Phone must have at least 1 character(s)' })
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
      message: 'Invalid phone number format',
    }),
  description: z.string().max(255).nullable(),
  specialty: z.string().max(45).nullable(),
  certificate: z.string().max(45).nullable(),
  imageUrl: z
    .string()
    .refine(
      (val) =>
        val === null ||
        (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(
          val
        ) === true &&
          val.length <= 255),
      {
        message: 'Invalid url format',
      }
    )
    .nullable(), // this `nullable()` is a must to let `null` pass
});

export const trainerDetailedSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must have at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email must have at most 45 character(s)' }),
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character requirement' }),
  username: z
    .string()
    .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
      message: 'Username only accepts letters and numbers, and must include at least 1 letter at the moment',
    })
    .max(45),
  firstName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  lastName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  phone: z
    .string()
    .min(1, { message: 'Phone must have at least 1 character(s)' })
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
      message: 'Invalid phone number format',
    }),
  description: z.string().max(255).nullable(),
  specialty: z.string().max(45).nullable(),
  certificate: z.string().max(45).nullable(),
  imageUrl: z
    .string()
    .refine(
      (val) =>
        val === null ||
        (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(
          val
        ) === true &&
          val.length <= 255),
      {
        message: 'Invalid url format',
      }
    ),
  lineOne: z.string().max(45).nullable(),
  lineTwo: z.string().max(45).nullable(),
  suburb: z.string().max(45).nullable(),
  postcode: z.string().max(10).nullable(),
  state: z.string().max(45).nullable(),
  country: z.string().max(45).nullable(),
});
