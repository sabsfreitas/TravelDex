const { Cidade } = require('./model');
const Sequelize = require('sequelize');

class CidadesRepository {
    constructor() {}

    async save(cidade) {
        try {
            const [novaCidade, created] = await Cidade.findOrCreate({
                where: { nome: cidade.nome, uf: cidade.uf }, 
                defaults: cidade
            });
    
            if (!created) {
                console.log(`Cidade ${cidade.nome} já existe.`);
            }
    
            return novaCidade;
        } catch (error) {
            console.error('Erro ao salvar a cidade:', error);
            throw new Error('Erro ao salvar a cidade');
        }
    }
    

    async detail(id) {
        try {
            const cidade = await Cidade.findByPk(id);
            if (!cidade) {
                throw new Error(`Cidade com ID ${id} não encontrada`);
            }
            return cidade;
        } catch (error) {
            console.error('Erro ao buscar detalhes da cidade:', error);
            throw new Error('Erro ao buscar detalhes da cidade');
        }
    }

    async list(limit = 10, offset = 0) {
        try {
            const listagem = await Cidade.findAndCountAll({
                limit,
                offset
            });
            return listagem;
        } catch (error) {
            console.error('Erro ao listar cidades:', error);
            throw new Error('Erro ao listar cidades');
        }
    }

    async findByNomeUf(nome, uf) {
        return await Cidade.findOne({
            where: {
                nome: nome,
                uf: uf
            }
        });
    }
}

module.exports = CidadesRepository;