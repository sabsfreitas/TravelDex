const { Cidade } = require('./model');
const Sequelize = require('sequelize');

class RegistrosRepository {
    constructor() {
    }

    async save(cidade) {
        await Cidade.create(cidade);
    }
}