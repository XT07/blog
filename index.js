const express = require("express");
const ex = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");
const categoryController = require("./categoryes/categoryController");
const articlesController = require("./articles/articlesController");

const registerCategory = require("./categoryes/Category");
const registerArticle = require("./articles/Article");

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
    res.render("home")
})

ex.listen(8080, () => {
    console.log("Server on")
})