const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Registro extends Model {}
    
Registro.init({
    idRegistro: {
        type: DataTypes.UUIDV1,
        primaryKey: true
    },
    foto: DataTypes.STRING
}, { 
    sequelize: sequelizeCon, 
    modelName: 'registro'
});

module.exports = { Registro };