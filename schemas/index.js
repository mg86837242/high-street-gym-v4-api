import { z } from 'zod';

export const emptyObjSchema = z.object({}).catchall(z.null());
export const idSchema = z.string().regex(/^\d+$/, { message: 'Invalid id format' });
export const dateSchema = z
  .string()
  .regex(
    /(^(((\d\d)(([02468][048])|([13579][26]))-02-29)|(((\d\d)(\d\d)))-((((0\d)|(1[0-2]))-((0\d)|(1\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))$)/,
    { message: 'Invalid date format' }
  );
export const uuidSchema = z.string().uuid({ message: 'Invalid access key format' });

// References:
// -- https://regex101.com/library/qW3tW2?orderBy=MOST_POINTS&search=date
