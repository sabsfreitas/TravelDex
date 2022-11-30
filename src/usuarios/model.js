const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');
const { Registro } = require('../registros/model');

class Usuario extends Model {}
    
Usuario.init({
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nome: DataTypes.STRING,
    senha: DataTypes.STRING
}, { 
    sequelize: sequelizeCon,
    modelName: 'usuario'
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

module.exports = { Usuario };