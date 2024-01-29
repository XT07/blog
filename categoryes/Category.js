const sequelize = require("sequelize");
const connection = require("../database/connection");

const category = connection.define("categoryes", {
    titulo: {
        type: sequelize.STRING,
        allowNull: false
    },slug: {
        type: sequelize.STRING,
        allowNull: false
    }
})

category.sync({ force: false }).then(() => {
    console.log("Tabela de categorias sincronizada")
}).catch((err) => {
    console.log(err)
})

module.exports = category;