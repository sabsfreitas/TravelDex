const Joi = require("joi");
const { Usuario } = require("../usuarios/model");

const userSchema = Joi.object({
    nome: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    senha: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string().email().required()
});

const authUserSchema = Joi.object({
    senha: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required()
});

const buscaUsersSchema = Joi.object({
    offset: Joi.number(),
    limit: Joi.number(),
    search: Joi.string().required()
});

const listUserSchema = Joi.object({
    offset: Joi.number(),
    limit: Joi.number()
});

const profileSchema = Joi.object({
    email: Joi.string().required()
});

const validaUsuario = (user) => {

    const validacao = userSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

const validaUsuarioAuth = (user) => {

    const validacao = authUserSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

const validaBuscaUsers = (user) => {

    const validacao = buscaUsersSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

const validaListUsers = (user) => {

    const validacao = listUserSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

const validaProfileSchema = (user) => {

    const validacao = profileSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

module.exports = { validaUsuario, validaUsuarioAuth, validaBuscaUsers, validaListUsers, validaProfileSchema };