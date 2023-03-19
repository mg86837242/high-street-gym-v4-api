import { z } from 'zod';
import { idSchema, dateSchema } from './index.js';

const bookingSchema = z.object({
  memberId: idSchema,
  trainerId: idSchema,
  activityId: idSchema,
  date: dateSchema,
  time: z.string().regex(/^\d{2}:00:00$/),
});

export default bookingSchema;
