const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');
const { Registro } = require('../registros/model');
const { Usuario } = require('../usuarios/model');

class Cidade extends Model {}
    
Cidade.init({
    id: {
        type: DataTypes.UUID,
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


Cidade.belongsToMany(Usuario, 
{
    through: Registro,
    as: 'usuarios',
    foreignKey: 'idCidade'
});

Usuario.belongsToMany(Cidade, 
{
    through: Registro,
    as: 'cidades',
    foreignKey: 'emailUsuario'
});

sequelizeCon.sync();

module.exports = { Cidade };