const express = require("express");
const router = express.Router();
const user = require("./Users");
const bcrypt = require("bcryptjs");
const adminAuth = require("../midolowares/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
    user.findAll({ raw: true }).then(users => {
        res.render("admin/users/index", {
            users: users
        })
    })
})

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create")
})

router.post("/admin/users/save", adminAuth, (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    user.findOne({ where: {email:email} }).then((emailSet => {
        if(emailSet == undefined){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt)
        
            user.create({
                name: name,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("create");
            })
        }else {
            res.redirect("/admin/users/create")
        }
    }))
})

router.get("/login", (req, res) => {
    res.render("admin/users/login");
})

router.post("/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    user.findOne({ where: { email:email } }).then((user) => {
        if(user !== undefined){
            let verifyPassword = bcrypt.compareSync(password,user.password);
            if(verifyPassword){
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect("/");
            }else{
                res.redirect("/login")
            }
        }else {
            res.redirect("/login")
        }
    })
})

router.get("/logout", adminAuth, (req, res) => {
    req.session.user = undefined;
    res.redirect("/login");
})

module.exports = router;