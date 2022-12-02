const { Sequelize } = require('sequelize');

const sequelizeCon = new Sequelize('postgresql://postgres:oXM2ueelkQBsM8tWAVCd@containers-us-west-92.railway.app:6196/railway', {
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