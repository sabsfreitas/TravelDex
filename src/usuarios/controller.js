const { Usuario } = require("./model");
const RegistrosRepository = require('../registros/repositorio-sql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validaUsuario, validaUsuarioAuth, validaBuscaUsers, validaListUsers, validaProfileSchema } = require("../validators/usuario");
const { Sequelize } = require('sequelize');
require('dotenv').config();

class UsuariosController {
  constructor() {
    this.repository = new RegistrosRepository();
  }

  async create(req, res) {
    try {
      const checaValidacao = await validaUsuario(req.body);
      if (checaValidacao === true) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }
      const { nome, email, senha } = req.body;

      const checaUsuario = await Usuario.findByPk(email);
      if (checaUsuario) {
        return res.status(400).json({ msg: "Esse e-mail já está cadastrado no sistema" });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const user = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        ativo: true
      });

      return res.status(201).json(user);
    } catch (err) {
      console.error("Erro no create:", err);
      return res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
  }

  async auth(req, res) {
    try {
      const checaValidacao = await validaUsuarioAuth(req.body);
      if (checaValidacao === true) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }

      const { email, senha } = req.body;
      const user = await Usuario.findByPk(email);

      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.status(400).json({ msg: "E-mail ou senha inválidos" });
      }

      if (!user.ativo) {
        user.ativo = true;
        await user.save();
      }

      const meuJwt = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "minhaChaveSecreta",
        { expiresIn: "1h" }
      );

      return res.json({ token: meuJwt });
    } catch (err) {
      console.error("Erro no auth:", err);
      return res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
  }

  async list(req, res) {
    try {
      const checaValidacao = await validaListUsers(req.query);
      if (checaValidacao === true) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }

      let { limit, offset } = req.query;
      limit = parseInt(limit, 10) || 10;
      offset = parseInt(offset, 10) || 0;

      if (!this.repository || !this.repository.topUsers || !this.repository.topCities) {
        return res.status(500).json({ msg: 'Erro no repositório de dados' });
      }

      const topUsers = await this.repository.topUsers();
      const topCities = await this.repository.topCities();
      const { count, rows } = await Usuario.findAndCountAll({
        limit,
        offset,
        where: { ativo: true },
      });

      const users = rows.map(({ dataValues: user }) => {
        delete user.senha;
        return user;
      });

      return res.status(200).json({ count, limit, offset, users, topUsers, topCities });
    } catch (err) {
      console.error("Erro no list:", err);
      return res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
  }

  async profile(req, res) {
    try {
      const checaValidacao = await validaProfileSchema(req.params);
      if (checaValidacao === true) {
        return res.status(400).json({ msg: 'Formato inválido' });
      }

      const { email } = req.params;
      const user = await Usuario.findByPk(email);
      if (!user) {
        return res.status(404).json({ msg: "Este usuário não está cadastrado." });
      }

      if (!user.ativo) {
        return res.status(404).json({ msg: "Este usuário teve sua conta deletada." });
      }

      const regs = await this.repository.userEntries(email);
      return res.json({ user, regs });
    } catch (err) {
      console.error("Erro no profile:", err);
      return res.status(500).json({ msg: 'Erro no servidor', error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const email = req.user.email;
      const user = await Usuario.findByPk(email);

      if (!user) {
        return res.status(404).json({ msg: "Esse e-mail não está cadastrado." });
      }

      user.ativo = false;
      await user.save();

      return res.status(200).json({ msg: "Conta deletada com sucesso" });
    } catch (err) {
      console.error("Erro no delete:", err);
      return res.status(500).json({ msg: 'Erro no servidor', error: err.message });
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
    console.log("search:", search);  // Verifique o valor de search

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
