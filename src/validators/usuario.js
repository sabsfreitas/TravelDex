const Joi = require("joi");

const userSchema = Joi.object({
    nome: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    senha: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9@#$%^&+=!]{3,30}$'))
        .required(),

    email: Joi.string().email().required()
});

const authUserSchema = Joi.object({
    senha: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$%^&+=!]{3,30}$')).required(),
    email: Joi.string().email().required()
});

const buscaUsersSchema = Joi.object({
    offset: Joi.number().min(0),
    limit: Joi.number().min(1),
    search: Joi.string().trim().required()
});

const listUserSchema = Joi.object({
    offset: Joi.number().min(0).default(0),
    limit: Joi.number().min(1).default(10)
});

const profileSchema = Joi.object({
    email: Joi.string().email().required()
});

const validar = (schema, data) => {
    const validacao = schema.validate(data, { abortEarly: false });
    return validacao.error ? validacao.error.details : null;
};

const validaUsuario = (user) => validar(userSchema, user);
const validaUsuarioAuth = (user) => validar(authUserSchema, user);
const validaBuscaUsers = (user) => validar(buscaUsersSchema, user);
const validaListUsers = (user) => validar(listUserSchema, user);
const validaProfileSchema = (user) => validar(profileSchema, user);

module.exports = { 
    validaUsuario, 
    validaUsuarioAuth, 
    validaBuscaUsers, 
    validaListUsers, 
    validaProfileSchema 
};