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
      protocol: 'postgres',
      username: 'postgres',
      host: 'ec2-54-157-79-121.compute-1.amazonaws.com',
      ...isProd,
      logging: false // unless you like the logs
    }
  );

module.exports = db;
