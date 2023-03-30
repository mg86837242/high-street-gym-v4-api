import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must have at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email must have at most 45 character(s)' }),
  // NB Max length of password is set to 100 for server-side validation b/c encrypting password results in longer
  //  password
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character requirement' }),
  username: z
    .string()
    .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
      message: 'Username only accepts letters and numbers, and must include at least 1 letter at the moment',
    })
    .max(45),
  firstName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  lastName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  phone: z
    .string()
    .min(1, { message: 'Phone must have at least 1 character(s)' })
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
      message: 'Invalid phone number format',
    })
    .max(45),
  age: z
    .number({ message: 'Age only accepts numbers' })
    .max(3, { message: 'Age must have at most 3 number(s)' })
    .nullable(),
  gender: z.enum(['Female', 'Male', 'Other', '']).nullable(),
});

export const memberSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must have at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email must have at most 45 character(s)' }),
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character requirement' }),
  username: z
    .string()
    .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
      message: 'Username only accepts letters and numbers, and must include at least 1 letter at the moment',
    })
    .max(45),
  firstName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  lastName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  phone: z
    .string()
    .min(1, { message: 'Phone must have at least 1 character(s)' })
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
      message: 'Invalid phone number format',
    })
    .max(45),
  age: z.number({ message: 'Age only accepts numbers' }).max(200, { message: 'Age must be at most 200' }).nullable(),
  gender: z.enum(['Female', 'Male', 'Other', '']).nullable(),
});

export const memberDetailedSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email must have at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email must have at most 45 character(s)' }),
  password: z
    .string()
    .min(8, { message: 'Password must have at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character requirement' }),
  username: z
    .string()
    .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
      message: 'Username only accepts letters and numbers, and must include at least 1 letter at the moment',
    })
    .max(45),
  firstName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  lastName: z
    .string()
    .min(1, { message: 'Name must have at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, { message: 'Name only accepts English letters at the moment' })
    .max(45),
  phone: z
    .string()
    .min(1, { message: 'Phone must have at least 1 character(s)' })
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
      message: 'Invalid phone number format',
    })
    .max(45),
  age: z.number({ message: 'Age only accepts numbers' }).max(200, { message: 'Age must be at most 200' }).nullable(),
  gender: z.enum(['Female', 'Male', 'Other', '']).nullable(),
  lineOne: z.string().max(45).nullable(),
  lineTwo: z.string().max(45).nullable(),
  suburb: z.string().max(45).nullable(),
  postcode: z.string().max(10).nullable(),
  state: z.string().max(45).nullable(),
  country: z.string().max(45).nullable(),
});

// NB Based on tests, `nullable()` won't let undefined pass, but will let null and empty string pass => PREFERRED
//  `optional()` won't let null pass, but will let undefined and empty string pass; when `enum()` is involved, both
//  won't accept empty string unless specified within `enum()`

// NB Empty form fields: (1) For fields that are not required but of enum data type, empty string is added as an option
//  to avoid validation error if the user submits an empty input field, see:
//  -- https://stackoverflow.com/questions/9177802/when-does-an-input-field-value-equals-null-or-undefined
//  -- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type: by default, the input type `text` is used
//  (2) `FormData.append()` converts field's value to a string in most cases:
//  -- https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#creating_a_formdata_object_from_scratch
//  (3) If its curl tests, field that is not included within the JSON `req.body` is considered as `undefined`
// console.log('🟢');
// console.log(z.string().max(45).optional().safeParse(undefined));
// console.log('🟢');
// curl -X POST http://localhost:8081/api/members/signup -H "Content-Type:application/json" -d '{"username":"testingmember", "password":"...", "firstName":"Some", "lastName":"Member", "phone":"0123456789", "email":"somemember@gmail.com"}'
