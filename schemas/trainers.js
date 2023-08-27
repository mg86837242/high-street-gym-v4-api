import { z } from 'zod';

import { countrySchema,lineOneSchema, lineTwoSchema, postcodeSchema, stateSchema, suburbSchema } from './addresses.js';
import { idSchema } from './params.js';
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema, phoneSchema,usernameSchema } from './users.js';

const descriptionSchema = z.string().trim().max(255).nullable();
const specialtySchema = z.string().trim().max(45).nullable();
const certificateSchema = z.string().trim().max(45).nullable();
const imageUrlSchema = z.string().trim().url().nullable();

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

export const updateTrainerSchema = z.object({
  params: z.object({ id: idSchema }),
  body: trainerSchema,
});

export const updateTrainerDetailedSchema = z.object({
  params: z.object({ id: idSchema }),
  body: trainerDetailedSchema,
});
