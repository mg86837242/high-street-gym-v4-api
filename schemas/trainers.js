import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema, firstNameSchema, lastNameSchema, phoneSchema } from './users.js';

export const trainerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  description: z.string().max(255).nullable(),
  specialty: z.string().max(45).nullable(),
  certificate: z.string().max(45).nullable(),
  // ??? Triggering server/backend 400 (e.g., change this union type) will cause session loss, which requires refresh and Effect to restore session; also, what about `sessionStorage` Web API
  imageUrl: z.union([
    z.string().length(0, { message: 'Image url must be empty or a valid url' }).nullable(),
    z.string().url(),
  ]),
});

export const trainerDetailedSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  description: z.string().max(255).nullable(),
  specialty: z.string().max(45).nullable(),
  certificate: z.string().max(45).nullable(),
  imageUrl: z.union([
    z.string().length(0, { message: 'Image url must be empty or a valid url' }).nullable(),
    z.string().url(),
  ]),
  lineOne: z.string().max(45).nullable(),
  lineTwo: z.string().max(45).nullable(),
  suburb: z.string().max(45).nullable(),
  postcode: z.string().max(10).nullable(),
  state: z.string().max(45).nullable(),
  country: z.string().max(45).nullable(),
});
