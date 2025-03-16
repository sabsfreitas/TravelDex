const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelizeCon = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

sequelizeCon
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
});

module.exports = { sequelizeCon };