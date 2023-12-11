import joi from 'joi';

export const signUpSchema = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

export const loginSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});
