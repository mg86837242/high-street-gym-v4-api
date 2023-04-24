import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema, firstNameSchema, lastNameSchema, phoneSchema } from './users.js';
import { lineOneSchema, lineTwoSchema, suburbSchema, postcodeSchema, stateSchema, countrySchema } from './addresses.js';

export const ageSchema = z
  .number({ message: 'Age must be a number' })
  .nonnegative()
  .max(999, { message: 'Age must have at most 3 digits' })
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

// NB Based on tests, `nullable()` won't let undefined pass, but will let null and empty string pass => PREFERRED
//  `optional()` won't let null pass, but will let undefined and empty string pass; when `enum()` is involved, both
//  won't accept empty string unless specified within `enum()`

// NB (1) Empty input fields is treated as empty string in `FormData` and RHF after validation:
//  -- https://stackoverflow.com/questions/9177802/when-does-an-input-field-value-equals-null-or-undefined
//  -- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type: by default, the input type `text` is used
//  (2) `FormData.append()` converts field's value to a string in most cases:
//  -- https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#creating_a_formdata_object_from_scratch
//  (3) If it's a curl/Postman test, field that is not included within the JSON `req.body` is considered as `undefined`

// NB Empty string within the `enum()` is for the "Choose ..." option in case the user wants to intentionally leave it
//  blank

// NB Empty input of "type='number" will be deemed as NaN during the validation by React Hook Form (or resolver), thus
//  this union type (however, will be converted to empty string after being returned from `handleSubmit()`), see this
//  Github post for alternative solution: https://github.com/orgs/react-hook-form/discussions/6980
