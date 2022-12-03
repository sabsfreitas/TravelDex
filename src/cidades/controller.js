const CidadesRepository = require('./repositorio-sql');

class CidadesController {

    constructor() {
        this.repository = new CidadesRepository();
    }

    async create(req, res) {
        const cidade = { 
            nome: req.body.cidade.nome,
            uf: req.body.cidade.uf, 
            pais: req.body.cidade.pais,
            bandeira: req.body.cidade.bandeira,
            populacao: req.body.cidade.populacao,
            pontosTuristicos: req.body.cidade.pontosTuristicos
        };

        await this.repository.save(cidade);
    
        return res.json({
            cidade
        });
    }
}
    