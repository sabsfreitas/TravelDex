const { Registro } = require('./model');
const Sequelize = require('sequelize');

class RegistrosRepository {
    constructor() {
    }

    async save(reg) {
        await Registro.create(reg);
    }
}