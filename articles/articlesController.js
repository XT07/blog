const express = require("express");
const router = express.Router();
const register = require("./Article");
const slugify = require("slugify");
const category = require("../categoryes/Category");
const { Sequelize, QueryTypes } = require('sequelize');


const sequelize = require('../database/connection');

router.get("/admin/articles", (req, res) => {
    sequelize.query(
        'SELECT articles.*, categoryes.titulo AS category_titulo ' +
        'FROM articles ' +
        'LEFT JOIN categoryes ON articles.categoryId = categoryes.id',
        { type: QueryTypes.SELECT }
    ).then(articles => {
        res.render("admin/articles/index", { articles: articles });
    })
});

router.get("/admin/articles/new", (req, res) => {
    category.findAll().then((categoryes) => {
        res.render("admin/articles/new", {
            category: categoryes
        })
    })
})

router.post("/admin/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.boddy;
    let category = req.body.category;
    register.create({
        titulo: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch((err) => {
        console.log(err)
    })
})

router.post("/admin/articles/delet", (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            register.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
})

router.post("/admin/articles/edit", (req, res) => {
    let id = req.body.id;
    register.findByPk(id).then((articleId) => {
        if (articleId != undefined){
            category.findAll().then((categoryes) => {
                res.render("admin/articles/edit", {
                    article: articleId,
                    category: categoryes
                })
            })
        }else {
            res.redirect("/admin/articles");
        }
    })
})

router.post("/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let boddy = req.body.boddy;
    let category = req.body.category;
    register.update({ titulo: title, slug: slugify(title), body: boddy, categoryeId: category },{ where: { id:id } }).then(() => {
        res.redirect("/admin/articles")
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router