const express = require("express");
const router = express.Router();
const register = require("./Category");
const slugify = require("slugify");

router.get("/admin/categoryes/new", (req, res) => {
    res.render("admin/categoryes/new");
})

router.post("/categoryes/save", (req, res) => {
    let title = req.body.title;
    if(title != undefined){
        register.create({
            titulo: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categoryes")
        })
    }else{
        res.redirect("/admin/categoryes/new")
    }
})

router.get("/admin/categoryes", (req, res) => {
    register.findAll({ raw: true }).then((categoryes) => {
        res.render("../views/admin/categoryes/index", {
            categoryes: categoryes
        })
    })
})

router.post("/category/delet", (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            register.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/categoryes")
            })
        }else{
            res.redirect("/admin/categoryes")
        }
    }else{
        res.redirect("/admin/categoryes")
    }
})

router.post("/admin/category/edit", (req, res) => {
    let id = req.body.id;
    register.findByPk(id).then((categoryId) => {
        if (categoryId != undefined){
            res.render("admin/categoryes/edit", {
                category: categoryId
            })
        }else {
            res.redirect("/admin/categoryes");
        }
    })
})

router.post("/category/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    register.update({ titulo: title, slug: slugify(title) },{ where: { id:id } }).then(() => {
        res.redirect("/admin/categoryes");
    })
})

module.exports = router;