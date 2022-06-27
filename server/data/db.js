const { Sequelize } = require("sequelize");

const isProd =  process.env.PROD ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}:{}
const db = new Sequelize('postgres', null,
    process.env.DATABASE_URL || "postgres",
    {
      dialect: 'postgres',
      ...isProd,
      logging: false // unless you like the logs
    }
  );

module.exports = db;
