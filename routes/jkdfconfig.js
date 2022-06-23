// require("dotenv").config();

var configjkdf = {};

configjkdf = {
  app: {
    port: 3030
  },
  db: {
    dbname: "jkdf",
    username: "gaugau",
    password: "12345",
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      mib: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
console.log(configjkdf);
module.exports = configjkdf;
