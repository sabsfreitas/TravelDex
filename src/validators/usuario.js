const Joi = require("joi");

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

const validaUsuario = (user) => {

    const validacao = userSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

module.exports = { validaUsuario };