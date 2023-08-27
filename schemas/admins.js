import { z } from 'zod';

import { countrySchema,lineOneSchema, lineTwoSchema, postcodeSchema, stateSchema, suburbSchema } from './addresses.js';
import { idSchema } from './params.js';
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema, phoneSchema,usernameSchema } from './users.js';

export const adminSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
});

export const adminDetailedSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  lineOne: lineOneSchema,
  lineTwo: lineTwoSchema,
  suburb: suburbSchema,
  postcode: postcodeSchema,
  state: stateSchema,
  country: countrySchema,
});

export const updateAdminSchema = z.object({
  params: z.object({ id: idSchema }),
  body: adminSchema,
});

export const updateAdminDetailedSchema = z.object({
  params: z.object({ id: idSchema }),
  body: adminDetailedSchema,
});
