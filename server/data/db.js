const { Sequelize } = require("sequelize");
console.log(process.env.DATABASE_URL, 'is there')
const db = new Sequelize(
    process.env.DATABASE_URL || "postgres://localhost:5432/postgres",
    {
      ssl: { rejectUnauthorized: false },
      logging: false // unless you like the logs
      // ...and there are many other options you may want to play with
    }
  );

module.exports = db;
