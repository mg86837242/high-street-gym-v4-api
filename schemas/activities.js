import { z } from 'zod';

export const activitySchema = z.object({
  name: z.string().trim().max(45).nullable(),
  category: z.enum(['Aerobic', 'Strength', 'Aerobic & Strength', 'Flexibility', '']).nullable(),
  description: z.string().trim().max(255).nullable(),
  intensityLevel: z.enum(['Low', 'Medium', 'High', 'Very High', 'Varies with Type', '']).nullable(),
  maxPeopleAllowed: z.number().nonnegative().nullable(),
  requirementOne: z.string().trim().max(100).nullable(),
  requirementTwo: z.string().trim().max(100).nullable(),
  durationMinutes: z.number().nonnegative(),
  price: z.number().nonnegative().nullable(),
});

export const activityXMLSchema = z.object({
  name: z.coerce.string().trim().max(45).nullable(),
  category: z.enum(['Aerobic', 'Strength', 'Aerobic & Strength', 'Flexibility', '']).nullable(),
  description: z.coerce.string().trim().max(255).nullable(),
  intensityLevel: z.enum(['Low', 'Medium', 'High', 'Very High', 'Varies with Type', '']).nullable(),
  maxPeopleAllowed: z.coerce.number().nonnegative().nullable(),
  requirementOne: z.coerce.string().trim().max(100).nullable(),
  requirementTwo: z.coerce.string().trim().max(100).nullable(),
  durationMinutes: z.coerce.number().nonnegative(),
  price: z.coerce.number().nonnegative().nullable(),
});
