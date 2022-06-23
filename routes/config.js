// require("dotenv").config();

var config = {};

config = {
  app: {
    port: 3030
  },
  db: {
    dbname: "gaugau_db",
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
console.log(config);
module.exports = config;
