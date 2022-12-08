const { Cidade } = require('./model');
const Sequelize = require('sequelize');

class CidadesRepository {
    constructor() {
    }

    async save(cidade) {
        await Cidade.create(cidade);
    }

    async detail(id) {
        const cidade = await Cidade.findByPk(id);
        return {
            cidade
        }
    }

    async list(limit, offset) {
        const listagem = await Cidade.findAndCountAll({
                limit: limit,
                offset: offset
        });
        return listagem;
    }
}

module.exports = CidadesRepository;