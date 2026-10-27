import Joi from "joi";

export const signupSchema = Joi.object({
    username: Joi.string()
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(7)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])"))
        .required()
});

export const loginSchema = Joi.object({
    identifier: Joi.string()
        .required(),

    password: Joi.string()
        .required()
});