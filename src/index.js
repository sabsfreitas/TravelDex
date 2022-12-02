const express = require('express');
const app = express();

const { Cidade } = require('./cidades/model');
const { validaUsuario } = require('./validators/usuario');
const { isAuth } = require('./middlewares/isAuth');

//const Joi = require('joi');
//const cors = require('cors');

app.use(express.json());
//app.use(cors());

const usuariosRouter = require('./usuarios/routes');
app.use('/usuarios', usuariosRouter);

app.listen(3000, () => console.log("Listening at 3000"));