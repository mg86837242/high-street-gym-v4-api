import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema, firstNameSchema, lastNameSchema, phoneSchema } from './users.js';
import { lineOneSchema, lineTwoSchema, suburbSchema, postcodeSchema, stateSchema, countrySchema } from './addresses.js';

const descriptionSchema = z.string().max(255).nullable();
const specialtySchema = z.string().max(45).nullable();
const certificateSchema = z.string().max(45).nullable();
// ??? Triggering server/backend 400 (e.g., change this union type) will cause session loss, which requires refresh and Effect to restore session
const imageUrlSchema = z.string().url().nullable();

export const trainerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  description: descriptionSchema,
  specialty: specialtySchema,
  certificate: certificateSchema,
  imageUrl: imageUrlSchema,
});

export const trainerDetailedSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  description: descriptionSchema,
  specialty: specialtySchema,
  certificate: certificateSchema,
  imageUrl: imageUrlSchema,
  lineOne: lineOneSchema,
  lineTwo: lineTwoSchema,
  suburb: suburbSchema,
  postcode: postcodeSchema,
  state: stateSchema,
  country: countrySchema,
});
