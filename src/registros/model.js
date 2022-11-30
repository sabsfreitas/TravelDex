const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');
const { Usuario } = require('../usuarios/model');
const { Cidade } = require('../cidades/model');

class Registro extends Model {}
    
Registro.init({
    idRegistro: {
        type: DataTypes.UUIDV1,
        primaryKey: true
    },
    emailUsuario: DataTypes.STRING,
    idCidade: DataTypes.STRING,
    foto: DataTypes.STRING
}, { 
    sequelize: sequelizeCon, 
    modelName: 'registro'
});

Usuario.hasMany(Registro, 
{
    foreignKey: 'emailUsuario',
    onDelete: 'CASCADE'
});

Registro.belongsTo(Usuario,
{
    foreignKey: 'emailUsuario'
});

Cidade.hasMany(Registro, 
{
    foreignKey: 'idCidade',
    onDelete: 'CASCADE'
});

Registro.belongsTo(Cidade,
{
    foreignKey: 'idCidade'
});

sequelizeCon.sync();

module.exports = { Registro };