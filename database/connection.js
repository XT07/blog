const sequelize = require("sequelize");

const connection = new sequelize("blog", "root", "89171304", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection;