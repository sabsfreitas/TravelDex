const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Registro extends Model {}
    
Registro.init({
    idRegistro: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    emailUsuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idCidade: {
        type: DataTypes.UUID,
        allowNull: false
    },
    foto: DataTypes.TEXT
}, { 
    sequelize: sequelizeCon, 
    modelName: 'registro',
    schema: 'travel_dex',
});

module.exports = { Registro };