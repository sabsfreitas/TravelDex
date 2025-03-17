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
        try {
            const cidades = req.body.cidades;
            if (!Array.isArray(cidades) || cidades.length === 0) {
                return res.status(400).json({ success: false, message: "Lista de cidades inválida ou vazia" });
            }
    
            const cidadesCriadas = await Promise.all(cidades.map(async cidade => {
                const novaCidade = {
                    id: crypto.randomUUID(),
                    nome: cidade.nome,
                    uf: cidade.uf,
                    pais: cidade.pais,
                    bandeira: cidade.bandeira,
                    populacao: cidade.populacao,
                    pontosTuristicos: cidade.pontosTuristicos
                };
    
                await this.repository.save(novaCidade);
                return novaCidade;
            }));
    
            return res.status(201).json({ success: true, data: cidadesCriadas });
    
        } catch (error) {
            console.error("Erro ao criar cidades:", error);
            return res.status(500).json({ success: false, message: "Erro interno ao adicionar cidades" });
        }
    }
    

    async list(req, res) {
        try {
            let { limit, offset } = req.query;
            limit = Number(limit) || 10;
            offset = Number(offset) || 0;
    
            const { count, rows } = await this.repository.list(limit, offset);
    
            return res.status(200).json({
                success: true,
                data: {
                    cidades: rows,
                    count,
                    limit,
                    offset,
                    hasMore: offset + limit < count
                }
            });
    
        } catch (error) {
            console.error("Erro ao listar cidades:", error);
            return res.status(500).json({ success: false, message: "Erro interno ao buscar cidades" });
        }
    }
    

    async detail(req, res) {
        try {
            const { id } = req.params;
            const cidade = await this.repository.detail(id);
    
            if (!cidade) {
                return res.status(404).json({ success: false, message: "Cidade não encontrada" });
            }
    
            const registros = await this.repository.registro.cityEntries(id);
    
            return res.status(200).json({
                success: true,
                data: { cidade, registros }
            });
    
        } catch (error) {
            console.error("Erro ao buscar detalhes da cidade:", error);
            return res.status(500).json({ success: false, message: "Erro interno ao buscar cidade" });
        }
    }
    

}

module.exports = CidadesController;