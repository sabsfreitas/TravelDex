const CidadesRepository = require('./repositorio-sql');
const RegistrosRepository = require('../registros/repositorio-sql');
const crypto = require('crypto');

class CidadesController {

    constructor() {
        this.repository = new CidadesRepository();
        this.repository.registro = new RegistrosRepository();
    }

    async create(req, res) {
        console.log("ADICIONANDO UMA NOVA CIDADE");
        const cidades = req.body.cidades;
        cidades.forEach(cidade => {
            const novaCidade = {
                id: crypto.randomUUID(), 
                nome: cidade.nome,
                uf: cidade.uf, 
                pais: cidade.pais,
                bandeira: cidade.bandeira,
                populacao: cidade.populacao,
                pontosTuristicos: cidade.pontosTuristicos
            };
    
            this.repository.save(novaCidade);
        });
    
        return res.json({
            cidades
        });
    }

    async list(req, res) {
        let { limit, offset } = req.query;
        if (!limit) limit = 10;
        if (!offset) offset = 0;
        const cidades = [];
        limit = Number(limit);
        offset = Number(offset);
        const { count, rows } = await this.repository.list(limit, offset);
        console.log(rows)
        rows.map(async({ dataValues: cidade }) => {
            cidades.push(cidade);
        });
        return res.status(200).json({ count, limit, offset, cidades });
    }

    async detail(req, res) {
        const { id } = req.params;
        const cidade = await this.repository.detail(id);
        const regs = await this.repository.registro.cityEntries(id);
        return res.json({
            cidade,
            regs
        });
    }

}

module.exports = CidadesController;