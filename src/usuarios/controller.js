const { Usuario } = require("./model");
const RegistrosRepository = require('../registros/repositorio-sql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validaUsuario } = require("../validators/usuario");
const { validaUsuarioAuth } = require("../validators/usuario");
const { validaBuscaUsers } = require("../validators/usuario");
const { validaListUsers } = require("../validators/usuario");
const { validaProfileSchema } = require("../validators/usuario");
const { Sequelize } = require('sequelize');

class UsuariosController {
  constructor() {
    this.repository = new RegistrosRepository();
  }

  async create(req, res) {
    try {
      const checaValidacao = await validaUsuario(req.body);
      if(checaValidacao) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }
      const { nome, email, senha } = req.body;
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
          ativo: true,
          senha
        };
        const userToDB = await Usuario.create(user);
        return res.status(201).json(userToDB);
      } else {
        return res
          .status(400)
          .json({ msg: "Esse e-mail já está cadastrado no sistema" });
      } 
    } catch(err) {
      return res.status(500).json({ msg: 'Erro no servidor' });
      }
    } 

  async auth(req, res) {
    const { email, senha } = req.body;

    try {
      const checaValidacao = await validaUsuarioAuth(req.body);
      if(checaValidacao) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }

    const user = await Usuario.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(400).json({ msg: "E-mail ou senha inválidos" });
    }
    

    if(user.dataValues.ativo == false) {
      user.set({
        ativo: true
      });
      await user.save();
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
  } catch(err) {
    return res.status(500).json({ msg: 'Erro no servidor' });
    }
  }

  async list(req, res) {
    try {
      const checaValidacao = await validaListUsers(req.query);
      if(checaValidacao) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }
    let { limit, offset } = req.query;
    if (!limit) limit = 10;
    if (!offset) offset = 0;
    limit = Number(limit);
    offset = Number(offset);
    const topUsers = await this.repository.topUsers();
    const topCities = await this.repository.topCities();
    const { count, rows } = await Usuario.findAndCountAll({
      limit,
      offset,
      where: { ativo: true },
    });
    const users = [];
    rows.map(({ dataValues: user }) => {
      delete user.senha;
      users.push(user);
    });
    return res.status(200).json({ count, limit, offset, users, topUsers, topCities });
  }
  catch(err) {
    return res.status(500).json({ msg: 'Erro no servidor' });
  } 
  }

  async profile(req, res) {
    try {
      const checaValidacao = await validaProfileSchema(req.params);
      if(checaValidacao) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }
    const { email } = req.params;
    const user = await Usuario.findByPk(email);
    const regs = await this.repository.userEntries(email);

    if (user != null) {
      if (user.ativo != false) {
        res.json({ user: user, regs: regs });
      } else {
        return res
          .status(404)
          .json({ msg: "Este usuário teve sua conta deletada." });
      }
    } else {
      return res.status(404).json({ msg: "Este usuário não está cadastrado." });
    }
  } catch(err) {
    return res.status(500).json({ msg: 'Erro no servidor' });
  } 
}

  async delete(req, res) {
    const email = req.user.email;
    const user = await Usuario.findByPk(email);

    if (user != null) {
      user.set({
        ativo: false,
      });
      await user.save();
      return res.status(200).json({ msg: "Conta deletada com sucesso" });
    } else {
      return res.status(404).json({ msg: "Esse e-mail não está cadastrado." });
    }
  }

  async buscaUsuarios(req, res) {
    try {
      const checaValidacao = await validaBuscaUsers(req.query);
      if(checaValidacao) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }
    let { search, limit, offset } = req.query;
    if (!limit) limit = 10;
    if (!offset) offset = 0;
    limit = Number(limit);
    offset = Number(offset);
    const { count, rows } = await Usuario.findAndCountAll({
      limit,
      offset,
      where: { ativo: true, nome: { [Sequelize.Op.iLike]: `%${search}%` } },
    });
    const users = [];
    rows.map(({ dataValues: user }) => {
      delete user.senha;
      users.push(user);
    });
    return res.status(200).json({ count, limit, offset, users });
  }
  catch(err) {
    let status = err.status || 500;
    return res.status(status).json({ msg: err.message });
  }
}
}

module.exports = UsuariosController;
