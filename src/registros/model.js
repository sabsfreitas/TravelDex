const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Registro extends Model {}
    
Registro.init({
    idRegistro: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    foto: DataTypes.TEXT
}, { 
    sequelize: sequelizeCon, 
    modelName: 'registro'
});

module.exports = { Registro };