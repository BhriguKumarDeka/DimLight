const Joi = require("joi");

exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    // At least 8 chars, include upper, lower, number, and symbol
    password: Joi.string()
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
    userType: Joi.string().valid("trouble", "curious", "wellness")
  });
  return schema.validate(data);
};

exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

exports.forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  });
  return schema.validate(data);
};

exports.resetPasswordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
  });
  return schema.validate(data);
};