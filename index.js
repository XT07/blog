const express = require("express");
const ex = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");
const categoryController = require("./categoryes/categoryController");
const articlesController = require("./articles/articlesController");
const registerCategory = require("./categoryes/Category");
const registerArticle = require("./articles/Article");
const { Sequelize, QueryTypes } = require("sequelize");
const userControler = require("./user/userControler");
const userDb = require("./user/Users");
const session = require("express-session")

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

ex.use(session({
    secret: "sfmiuewhfgnuhldsk90irfjsfsefess45d89w45ds1a18w4asdgdg4rgd4hgf48g45hf1t4s0d121f541d2f0esfs4aw9d4f0reg",
    cookie: { maxAge:30000 }
}))

ex.use("/", categoryController);
ex.use("/", articlesController);
ex.use("/", userControler);

ex.get("/", (req, res) => {
    registerArticle.findAll({ limit: 4, order: [ [ "id","DESC" ] ] }).then((articles) => {
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
        offset = (num - 1) * 4;
    }

    registerArticle.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [ [ "id","DESC" ] ]
    }).then(articles => {
        let next;
        if(offset >= articles.count){
            next = false;
        }else {
            next = true;
        }

        let result = { 
            page: num, 
            next: next, 
            articles: articles 
        }
        res.render("admin/articles/pages.ejs", {
            result: result
        })
    })
})

ex.listen(8080, () => {
    console.log("Server on")
})