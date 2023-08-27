import { z } from 'zod';

import { dateSchema,idSchema } from './params.js';

export const bookingSchema = z.object({
  memberId: idSchema,
  trainerId: idSchema,
  activityId: idSchema,
  date: dateSchema,
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:00:00$/),
});

export const updateBookingSchema = z.object({
  params: z.object({ id: idSchema }),
  body: bookingSchema,
});
