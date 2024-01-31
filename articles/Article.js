const sequelize = require("sequelize");
const connection = require("../database/connection")
const category = require("../categoryes/Category");

const article = connection.define("articles", {
    titulo: {
        type: sequelize.STRING,
        allowNull: false
    },slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

article.belongsTo(category, {as: 'category', foreignKey: 'categoryId' });
category.hasMany(article);

article.sync({ force: false }).then(() => {
    console.log("Tabela de artigos sincronizada")
}).catch((err) => {
    console.log(err)
})

module.exports = article;