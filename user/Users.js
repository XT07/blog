const sequelize = require("sequelize");
const connection = require("../database/connection")

const user = connection.define("users", {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.TEXT,
        allowNull: false
    },
})

user.sync({ force: false }).then(() => {
    console.log("Tabela de artigos sincronizada")
}).catch((err) => {
    console.log(err)
})

module.exports = user;