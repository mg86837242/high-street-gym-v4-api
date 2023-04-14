import { z } from 'zod';

const activitySchema = z.object({
  name: z.string().max(45).nullable(),
  category: z.enum(['Aerobic', 'Strength', 'Aerobic & Strength', 'Flexibility', '']).nullable(),
  description: z.string().max(255).nullable(),
  intensityLevel: z.enum(['Low', 'Medium', 'High', 'Very High', 'Varies with Type', '']).nullable(),
  maxPeopleAllowed: z.number().nonnegative().nullable(),
  requirementOne: z.string().max(100).nullable(),
  requirementTwo: z.string().max(100).nullable(),
  durationMinutes: z.number().nonnegative(),
  price: z.number().nonnegative().nullable(),
});

export default activitySchema;
