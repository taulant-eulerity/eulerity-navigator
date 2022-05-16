const { Sequelize } = require("sequelize");


const isProd =  process.env.PROD ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}:{}
const db = new Sequelize(
    process.env.DATABASE_URL || "postrgres",
    {
      ...isProd,
      logging: false // unless you like the logs
    }
  );

module.exports = db;
