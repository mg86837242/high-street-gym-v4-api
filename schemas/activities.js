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

// NB Empty string within the `enum()` is for the "Choose ..." option in case the user wants to intentionally leave it
//  blank
// NB Empty input of "type='number" will be deemed as NaN during the validation by React Hook Form (or resolver), thus
//  this union type (however, will be converted to empty string after being returned from `handleSubmit()`), see this
//  Github post for alternative solution: https://github.com/orgs/react-hook-form/discussions/6980
