import joi from "joi";

export const transactionSchema = joi.object().keys({
    value: joi.number().required(),
    description: joi.string().max(10).required(),
  });