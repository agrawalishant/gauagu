const configjkdf = require('../routes/jkdfconfig')
const {db:{dbname, username, password, host, dialect}} = configjkdf
const jkdfconfig = require('sequelize');

const lodsql = new jkdfconfig(dbname,username ,password, {
    host: host,
    dialect: dialect
  });


module.exports = lodsql  