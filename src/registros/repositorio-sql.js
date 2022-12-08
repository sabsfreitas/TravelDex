const { Registro } = require('./model');
const { Usuario } = require('../usuarios/model');
const { Cidade } = require('../cidades/model');
const Sequelize = require('sequelize');
const { sequelizeCon } = require('../config/db-config');
const { QueryTypes } = require('sequelize');

class RegistrosRepository {
    constructor() {
    }

    async save(reg) {
        await Registro.create(reg);
    }

    async userEntries(email) {
        const regs = await Registro.findAll({ 
            where: { emailUsuario: email }
        });

        return {
            regs
        }
    }

    async cityEntries(id) {
        const regs = await Registro.findAll({ 
            where: { idCidade: id }
        });

        return {
            regs
        }
    }

    async topUsers() {

      const regs = await Registro.findAll({
            attributes: [
                'emailUsuario',
                [sequelizeCon.fn('COUNT', ('email')), 'userEntries']
            ],
            group: [['emailUsuario']],
            order: [[('userEntries'), 'DESC']],
            limit: 5
        }); 
        let nomes = [];
        for (let i = 0; i < regs.length; i++) {
            const element = regs[i];
            let emailAll = element.emailUsuario;
            let qtdCidades = element.dataValues.userEntries;
        const [nameFromRegs] = await sequelizeCon.query(`SELECT nome FROM usuarios WHERE usuarios.email = '${emailAll}'`);
     nomes = [...nomes, nameFromRegs, qtdCidades]
    };
     return {
        nomes
     }
    }

    async topCities() {
      const regs = await Registro.findAll({
            attributes: [
                'idCidade',
                [sequelizeCon.fn('COUNT', ('id')), 'cityEntries']
            ],
            group: [['idCidade']],
            order: [[('cityEntries'), 'DESC']],
            limit: 5
        })     
        let nomes = [];
        for (let i = 0; i < regs.length; i++) {
            const element = regs[i];
            let idCidade = element.idCidade;
            let qtdCidades = element.dataValues.cityEntries;
            
        const [nameFromRegs] = await sequelizeCon.query(`SELECT nome FROM cidades WHERE cidades.id = '${idCidade}'`);
     nomes = [...nomes, nameFromRegs, qtdCidades]
    };
        return {
            nomes
        }
    }

    async delete(idRegistro) {
        const reg = await Registro.findByPk(idRegistro);
        if (reg != null) {
            await reg.destroy();
            return true;
        }
        return false;
    }
}

module.exports = RegistrosRepository;