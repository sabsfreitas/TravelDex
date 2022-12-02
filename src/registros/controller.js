const RegistrosRepository = require('./repositorio-sql');

class RegistrosController {

    constructor() {
        this.repository = new RegistrosRepository();
    }

    async create(req, res) {
        const reg = { 
            emailUsuario: req.user.email,
            idCidade: req.params.reg.cidade, 
            foto: req.body.reg.foto
        };


        await this.repository.save(reg);

        
        return res.json({
            reg
        });
    }
}
    