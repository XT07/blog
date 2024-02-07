const express = require("express");
const ex = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");
const categoryController = require("./categoryes/categoryController");
const articlesController = require("./articles/articlesController");
const registerCategory = require("./categoryes/Category");
const registerArticle = require("./articles/Article");
const { Sequelize, QueryTypes } = require("sequelize")

const sequelize = require("./database/connection");

connection
    .authenticate()
    .then(() => {
        console.log("Sistema conectado ao banco de dados");
    })
    .catch((err) => {
        console.log(err);
    })

ex.set("view engine", "ejs");
ex.use(express.static("public"));
ex.use(bodyParser.urlencoded({ extended: false }));
ex.use(bodyParser.json());

ex.use("/", categoryController);
ex.use("/", articlesController);

ex.get("/", (req, res) => {
    registerArticle.findAll().then((articles) => {
        res.render("home", {
            article: articles
        })
    })
})

ex.get("/articles/pages/:num", (req, res) => {
    let num = parseInt(req.params.num);
    let offset = 0;

    if(num <= 1){
        offset = 0;
    } else {
        offset = (num) * 4;
    }

    registerArticle.findAndCountAll({
        limit: 4,
        offset: offset
    }).then(articles => {
        let next;
        if(offset >= articles.count){
            next = false;
        }else {
            next = true;
        }

        let result = { next: next, articles: articles }
        res.render("admin/articles/pages.ejs", {
            result: result
        })
    })
})

ex.listen(8080, () => {
    console.log("Server on")
})