const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');
const { Registro } = require('../registros/model');

class Cidade extends Model {}
    
Cidade.init({
    id: {
        type: DataTypes.UUIDV1,
        primaryKey: true
    },
    nome: DataTypes.STRING,
    uf: DataTypes.STRING,
    pais: DataTypes.STRING,
    bandeira: DataTypes.STRING,
    populacao: DataTypes.STRING,
    pontosTuristicos: DataTypes.JSON
}, { 
    sequelize: sequelizeCon, 
    modelName: 'cidade'
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

module.exports = { Cidade };