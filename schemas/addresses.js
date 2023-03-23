import { z } from 'zod';

export const addressSchema = z.object({
  lineOne: z.string().max(45).nullable(),
  lineTwo: z.string().max(45).nullable(),
  suburb: z.string().max(45).nullable(),
  postcode: z.string().max(10).nullable(),
  state: z.string().max(45).nullable(),
  country: z.string().max(45).nullable(),
});

export default addressSchema;
