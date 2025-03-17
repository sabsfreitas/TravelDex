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
        const erros = validaUsuario(req.body);
        if (erros) {
            return res.status(400).json({ success: false, message: 'Erro de validação.', errors: erros });
        }

        const { nome, email, senha } = req.body;

        const checaUsuario = await Usuario.findByPk(email);
        if (checaUsuario) {
            return res.status(409).json({ success: false, message: "Esse e-mail já está cadastrado no sistema." });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const user = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            ativo: true
        });

        return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso.",
            data: { nome: user.nome, email: user.email, ativo: user.ativo }
        });

    } catch (err) {
        console.error("Erro no create:", err);
        return res.status(500).json({ success: false, message: 'Erro no servidor.', error: err.message });
    }
}

async auth(req, res) {
  try {
      const erros = validaUsuarioAuth(req.body);
      if (erros) {
          return res.status(400).json({ success: false, message: 'Erro de validação.', errors: erros });
      }

      const { email, senha } = req.body;
      const user = await Usuario.findByPk(email);

      if (!user || !(await bcrypt.compare(senha, user.senha))) {
          return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });
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

      return res.status(200).json({
          success: true,
          message: "Autenticação bem-sucedida.",
          token: meuJwt,
          user: { nome: user.nome, email: user.email }
      });

  } catch (err) {
      console.error("Erro no auth:", err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.', error: err.message });
  }
}

async list(req, res) {
  try {
      const erros = validaListUsers(req.query);
      if (erros) {
          return res.status(400).json({ success: false, message: 'Erro de validação.', errors: erros });
      }

      let { limit, offset } = req.query;
      limit = parseInt(limit, 10) || 10;
      offset = parseInt(offset, 10) || 0;

      const topUsers = this.repository?.topUsers ? await this.repository.topUsers() : [];
      const topCities = this.repository?.topCities ? await this.repository.topCities() : [];

      const { count, rows } = await Usuario.findAndCountAll({
          limit,
          offset,
          where: { ativo: true },
      });

      const users = rows.map(({ dataValues: user }) => {
          delete user.senha;
          return user;
      });

      return res.status(200).json({
          success: true,
          message: "Usuários listados com sucesso.",
          count,
          limit,
          offset,
          users,
          topUsers,
          topCities
      });

  } catch (err) {
      console.error("Erro no list:", err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.', error: err.message });
  }
}

async profile(req, res) {
  try {
      const erros = validaProfileSchema(req.params);
      if (erros) {
          return res.status(400).json({ success: false, message: 'Erro de validação.', errors: erros });
      }

      const { email } = req.params;
      const user = await Usuario.findByPk(email);

      if (!user) {
          return res.status(404).json({ success: false, message: "Usuário não encontrado." });
      }

      if (!user.ativo) {
          return res.status(403).json({ success: false, message: "Este usuário teve sua conta desativada." });
      }

      const regs = await this.repository.userEntries(email);

      return res.status(200).json({
          success: true,
          message: "Perfil encontrado.",
          user: { nome: user.nome, email: user.email },
          registros: regs
      });

  } catch (err) {
      console.error("Erro no profile:", err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.', error: err.message });
  }
}

async delete(req, res) {
  try {
      const email = req.user.email;
      const user = await Usuario.findByPk(email);

      if (!user) {
          return res.status(404).json({ success: false, message: "Usuário não encontrado." });
      }

      user.ativo = false;
      await user.save();

      return res.status(204).send();

  } catch (err) {
      console.error("Erro no delete:", err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.', error: err.message });
  }
}

async buscaUsuarios(req, res) {
  try {
      const erros = validaBuscaUsers(req.query);
      if (erros) {
          return res.status(400).json({ success: false, message: 'Erro de validação.', errors: erros });
      }

      let { search, limit, offset } = req.query;
      limit = parseInt(limit, 10) || 10;
      offset = parseInt(offset, 10) || 0;

      const { count, rows } = await Usuario.findAndCountAll({
          limit,
          offset,
          where: { ativo: true, nome: { [Sequelize.Op.iLike]: `%${search}%` } },
      });

      const users = rows.map(({ dataValues: user }) => {
          delete user.senha;
          return user;
      });

      return res.status(200).json({
          success: true,
          message: "Busca concluída.",
          count,
          limit,
          offset,
          users
      });

  } catch (err) {
      console.error("Erro no buscaUsuarios:", err);
      return res.status(500).json({ success: false, message: err.message });
  }
}

}

module.exports = UsuariosController;
