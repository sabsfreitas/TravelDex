const { Usuario } = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validaUsuario } = require('../validators/usuario');

class UsuariosController {
  constructor() {}

  async create(req, res) {
    const { nome, email, senha } = req.body;

    if (validaUsuario) {
      const checaUsuario = await Usuario.findOne({
        where: {
          email,
        },
      });

      if (!checaUsuario) {
        const usuarioBody = req.body;
        const senha = await bcrypt.hash(usuarioBody.senha, 10);
        const user = {
          nome: usuarioBody.nome,
          email: usuarioBody.email,
          senha,
        };
        const userToDB = await Usuario.create(user);
        return res.status(201).json(userToDB);
      } else {
        return res
          .status(400)
          .json({ msg: "Esse e-mail já está cadastrado no sistema" });
      }
    } else {
      return res.status(400);
    }
  }

  async auth(req, res) {
    const { email, senha } = req.body;

    const user = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "E-mail ou senha inválidos" });
    }

    const checa = await bcrypt.compare(senha, user.senha);

    if (checa) {
      const meuJwt = jwt.sign(
        user.dataValues,
        "Secret não poderia estar hardcoded"
      );

      return res.json(meuJwt);
    } else {
      return res.status(400).json({ msg: "E-mail ou senha inválidos" });
    }
  }

  async list(req, res) {
    const users = await Usuario.findAndCountAll({
        limit: 10,
        offset: 0
    });
    return res.status(200).json(users);
  }
}

module.exports = UsuariosController;
