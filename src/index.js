const express = require('express');
const app = express();

const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const CidadesRepository = require('./cidades/repositorio-sql.js');
require('dotenv').config()

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.static('public'));

const usuariosRouter = require('./usuarios/routes');
app.use('/usuarios', usuariosRouter);

const cidadesRouter = require('./cidades/routes');
app.use('/cidades', cidadesRouter);

const registroRouter = require('./registros/routes');
app.use('/registros', registroRouter);

async function importarCidades() {
    const filePath = path.join(__dirname, 'cidades/entries.json');
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);

    const repository = new CidadesRepository();

    for (const cidade of data.cidades) {
        const cidadeExistente = await repository.findByNomeUf(cidade.nome, cidade.uf);
        
        if (!cidadeExistente) {
            const novaCidade = {
                id: crypto.randomUUID(),
                nome: cidade.nome,
                uf: cidade.uf,
                pais: cidade.pais,
                bandeira: cidade.bandeira,
                populacao: cidade.populacao,
                pontosTuristicos: cidade.pontosTuristicos
            };

            await repository.save(novaCidade);
            console.log(`Cidade ${cidade.nome} adicionada.`);
        } else {
            console.log(`Cidade ${cidade.nome} já existe no banco.`);
        }
    }

    console.log("Importação concluída!");
}

app.post('/importar-cidades', async (req, res) => {
    try {
        await importarCidades();
        res.status(200).json({ message: "Importação concluída" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao importar cidades." });
    }
});

app.listen(process.env.PORT, () => console.log("Listening at port " + process.env.PORT));