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
    const width = 320;
    const height = 320;
    req.body.images = [];
    const newFilename = req.file.filename + "new";

    await sharp(req.file.path)
    .resize(width, height, {
      fit: "inside",
    })
    .toFormat("jpeg")
    .jpeg({ quality: 60 })
    .toFile(`public/images/${newFilename}`);

    req.body.images.push(newFilename);

    //const output = await data.toBuffer();
    const output = fs.readFileSync("public/images/" + req.body.images[0]);
    const toBase64 = output.toString("base64");

    if(!req.user.email) {
        return res.status(401);
    }
    if (!validaRegistro) {
      return false;
    }

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
        return res.status(409).json({ msg: 'Esse item já existe na sua Dex. '});
    }

    await this.repository.save(reg);

    return res.json({
      reg
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const registro = await this.repository.delete(id);
   
    if (registro === false) {
      return res.status(404).json({ msg: "Esse ID não existe." });
    } else if (registro === true) {
      return res.status(200).json({ msg: "Registro deletado com sucesso" });
    }
  }
}

module.exports = RegistrosController;