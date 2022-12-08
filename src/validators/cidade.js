const Joi = require("joi");

const cidadeSchema = Joi.object({
    nome: Joi.string().required(),
    uf: Joi.string().required(),
    pais: Joi.string().required(),
    bandeira: Joi.string().required(),
    populacao: Joi.number().positive().required(),
    pontosTuristicos: Joi.array().items(Joi.string())
});

const validaCidade = (cidade) => {

    const validacao = cidadeSchema.validate(cidade, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
}

module.exports = { validaCidade };