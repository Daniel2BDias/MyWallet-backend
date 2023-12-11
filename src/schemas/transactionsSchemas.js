import joi from 'joi';

export const transactionSchema = joi.object().keys({
  value: joi.number().positive().greater(0).required(),
  description: joi.string().required(),
});
