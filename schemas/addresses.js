import { z } from 'zod';

export const lineOneSchema = z.string().max(45);
export const lineTwoSchema = z.string().max(45);
export const suburbSchema = z.string().max(45);
export const postcodeSchema = z.string().max(10);
export const stateSchema = z.string().max(45);
export const countrySchema = z.string().max(45);

export const addressSchema = z.object({
  lineOne: lineOneSchema,
  lineTwo: lineTwoSchema,
  suburb: suburbSchema,
  postcode: postcodeSchema,
  state: stateSchema,
  country: countrySchema,
});
