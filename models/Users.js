const config = require('../routes/config')
const {db:{dbname, username, password, host, dialect}} = config
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbname,username ,password, {
    host: host,
    dialect: dialect
  });


module.exports = sequelize  