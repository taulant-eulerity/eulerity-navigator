const { Sequelize } = require("sequelize");

const isProd =  process.env.PROD ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}:{}
console.log(process.env.PSQL_HOST, 'A what is this')
const db = new Sequelize('postgres', null,
    process.env.DATABASE_URL || "postgres",
    {
      host: 'ec2-54-157-79-121.compute-1.amazonaws.com',
      dialect: 'postgres',
      protocol: 'postgres',
      ...isProd,
      logging: false // unless you like the logs
    }
  );

module.exports = db;
