const { Sequelize } = require('sequelize');

const sequelizeCon = new Sequelize('postgresql://postgres:oXM2ueelkQBsM8tWAVCd@containers-us-west-92.railway.app:6196/railway', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

try {
    await sequelizeCon.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = { sequelizeCon };