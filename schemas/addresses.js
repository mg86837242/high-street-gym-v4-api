import { z } from 'zod';

import { idSchema } from './params.js';

export const lineOneSchema = z.string().trim().max(45);
export const lineTwoSchema = z.string().trim().max(45);
export const suburbSchema = z.string().trim().max(45);
export const postcodeSchema = z.string().trim().max(45);
export const stateSchema = z.string().trim().max(45);
export const countrySchema = z.string().trim().max(45);

export const addressSchema = z.object({
  lineOne: lineOneSchema,
  lineTwo: lineTwoSchema,
  suburb: suburbSchema,
  postcode: postcodeSchema,
  state: stateSchema,
  country: countrySchema,
});

export const updateAddressSchema = z.object({
  params: z.object({ id: idSchema }),
  body: addressSchema,
});

export const updateAddressByAdminIdSchema = z.object({
  params: z.object({ adminId: idSchema }),
  body: addressSchema,
});

export const updateAddressByTrainerIdSchema = z.object({
  params: z.object({ trainerId: idSchema }),
  body: addressSchema,
});

export const updateAddressByMemberIdSchema = z.object({
  params: z.object({ memberId: idSchema }),
  body: addressSchema,
});
