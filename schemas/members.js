import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema, firstNameSchema, lastNameSchema, phoneSchema } from './users.js';
import { lineOneSchema, lineTwoSchema, suburbSchema, postcodeSchema, stateSchema, countrySchema } from './addresses.js';

export const ageSchema = z
  .number({ message: 'Age only accepts numbers' })
  .nonnegative()
  .max(999, { message: 'Age only accepts at most 3 digits' })
  .nullable();
export const genderSchema = z.enum(['Female', 'Male', 'Other', '']).nullable();

export const memberSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  age: ageSchema,
  gender: genderSchema,
});

export const memberDetailedSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  age: ageSchema,
  gender: genderSchema,
  lineOne: lineOneSchema,
  lineTwo: lineTwoSchema,
  suburb: suburbSchema,
  postcode: postcodeSchema,
  state: stateSchema,
  country: countrySchema,
});

export const memberDetailedXMLSchema = z.object({
  email: z.coerce
    .string()
    .min(1, { message: 'Email only accepts at least 1 character(s)' })
    .email()
    .max(45, { message: 'Email only accepts at most 45 character(s)' }),
  password: z.coerce
    .string()
    .min(8, { message: 'Password only accepts at least 8 character(s)' })
    .max(100, { message: 'Password exceeds maximum character allowance' }),
  username: z.coerce
    .string()
    .regex(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]+$/, {
      message: 'Username only accepts English letters and numbers, and must include at least 1 letter',
    })
    .max(45, { message: 'Username only accepts at most 45 character(s)' }),
  firstName: z.coerce
    .string()
    .min(1, { message: 'Name only accepts at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Name only accepts English letters',
    })
    .max(45),
  lastName: z.coerce
    .string()
    .min(1, { message: 'Name only accepts at least 1 character(s)' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Name only accepts English letters',
    })
    .max(45),
  phone: z.coerce
    .string()
    .min(1, { message: 'Phone only accepts at least 1 character(s)' })
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, {
      message: 'Invalid phone number format',
    })
    .max(45),
  age: z.coerce
    .number({ message: 'Age only accepts numbers' })
    .nonnegative()
    .max(999, { message: 'Age only accepts at most 3 digits' })
    .nullable(),
  gender: z.enum(['Female', 'Male', 'Other', '']).nullable(),
  lineOne: z.coerce.string().max(45),
  lineTwo: z.coerce.string().max(45),
  suburb: z.coerce.string().max(45),
  postcode: z.coerce.string().max(45),
  state: z.coerce.string().max(45),
  country: z.coerce.string().max(45),
});

// NB Based on tests, `nullable()` won't let undefined pass, but will let null and empty string pass => PREFERRED
//  `optional()` won't let null pass, but will let undefined and empty string pass; when `enum()` is involved, both
//  won't accept empty string unless specified within `enum()`

// NB (1) Empty input fields is treated as empty string in `FormData` and RHF after validation:
//  -- https://stackoverflow.com/questions/9177802/when-does-an-input-field-value-equals-null-or-undefined
//  -- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type: by default, the input type `text` is used
//  (2) `FormData.append()` converts field's value to a string in most cases:
//  -- https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#creating_a_formdata_object_from_scratch
//  (3) If it's a curl/Postman test, field that is not included within the JSON `req.body` is considered as `undefined`
