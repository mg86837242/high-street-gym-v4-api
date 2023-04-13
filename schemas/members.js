import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema, firstNameSchema, lastNameSchema, phoneSchema } from './users.js';

export const ageSchema = z
  .number({ message: 'Age only accepts numbers' })
  .nonnegative()
  .max(999, { message: 'Age must have at most 3 digits' })
  .nullable();
export const genderSchema = z.enum(['Female', 'Male', 'Other', '']).nullable();

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
  age: ageSchema,
  gender: genderSchema,
});

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
//  (3) If it's a curl test, field that is not included within the JSON `req.body` is considered as `undefined`
// console.log('🟢');
// console.log(z.string().max(45).optional().safeParse(undefined));
// console.log('🟢');
// curl -X POST http://localhost:8081/api/members/signup -H "Content-Type:application/json" -d '{"username":"testingmember", "password":"...", "firstName":"Some", "lastName":"Member", "phone":"0123456789", "email":"somemember@gmail.com"}'
