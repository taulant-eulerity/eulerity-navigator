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
    process.env.DATABASE_URL || "postgres://localhost:5432/postgres",
    {
      ...isProd,
      logging: false // unless you like the logs
    }
  );

module.exports = db;
