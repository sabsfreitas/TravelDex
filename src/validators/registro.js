const Joi = require("joi");

const registroSchema = Joi.object({
    foto: Joi.string()
        .pattern(new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$')),
});

const validaRegistro = (registro) => {

    const validacao = registroSchema.validate(registro, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

module.exports = { validaRegistro };