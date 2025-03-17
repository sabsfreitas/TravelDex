const RegistrosRepository = require('./repositorio-sql');
const crypto = require('crypto');
const sharp = require('sharp');
const fs = require('fs');
const { validaRegistro } = require('../validators/registro');
const { Registro } = require('../registros/model');

class RegistrosController {
  constructor() {
    this.repository = new RegistrosRepository();
  }

  async create(req, res) {
    try {
        const width = 320;
        const height = 320;
        const erros = validaRegistro(req.body)

        if (!req.user?.email) {
            return res.status(401).json({ success: false, message: "Usuário não autenticado." });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
        }

        if (erros) {
            return res.status(400).json({ success: false, message: "Dados inválidos para registro." });
        }

        const newFilename = req.file.filename + "new.jpg";
        const outputPath = `public/images/${newFilename}`;

        await sharp(req.file.path)
            .resize(width, height, { fit: "inside" })
            .toFormat("jpeg")
            .jpeg({ quality: 60 })
            .toFile(outputPath);

        const output = fs.readFileSync(outputPath);
        const toBase64 = output.toString("base64");

        const reg = {
            idRegistro: crypto.randomUUID(),
            emailUsuario: req.user.email,
            idCidade: req.params.idCidade,
            foto: toBase64
        };

        const checaRegistro = await Registro.findOne({
            where: { idCidade: reg.idCidade, emailUsuario: reg.emailUsuario }
        });

        if (checaRegistro) {
            return res.status(409).json({ success: false, message: "Esse item já existe na sua Dex." });
        }

        await this.repository.save(reg);

        return res.status(201).json({
            success: true,
            message: "Registro criado com sucesso.",
            data: reg
        });

    } catch (error) {
        console.error("Erro ao criar registro:", error);
        return res.status(500).json({ success: false, message: "Erro interno ao criar registro." });
    }
}

async delete(req, res) {
  try {
      const { id } = req.params;
      const registro = await this.repository.delete(id);

      if (!registro) {
          return res.status(404).json({ success: false, message: "Registro não encontrado." });
      }

      return res.status(200).json({ success: true, message: "Registro deletado com sucesso." });

  } catch (error) {
      console.error("Erro ao deletar registro:", error);
      return res.status(500).json({ success: false, message: "Erro interno ao deletar registro." });
  }
}

}

module.exports = RegistrosController;