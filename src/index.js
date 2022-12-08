const express = require('express');
const app = express();

const { validaUsuario } = require('./validators/usuario');
const { isAuth } = require('./middlewares/isAuth');

//const Joi = require('joi');
//const cors = require('cors');

app.use(express.json());
//app.use(cors());

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.static('public'));

const usuariosRouter = require('./usuarios/routes');
app.use('/usuarios', usuariosRouter);

const cidadesRouter = require('./cidades/routes');
app.use('/cidades', cidadesRouter);

const registroRouter = require('./registros/routes');
app.use('/registro', registroRouter);

app.listen(5000, () => console.log("Listening at 5000"));