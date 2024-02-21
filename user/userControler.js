const express = require("express");
const router = express.Router();
const user = require("./Users");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    user.findAll({ raw: true }).then(users => {
        res.render("admin/users/index", {
            users: users
        })
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/admin/users/save", (req, res) => {
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
                res.json(req.session.user);
            }else{
                res.redirect("/login")
            }
        }else {
            res.redirect("/login")
        }
    })
})

module.exports = router;