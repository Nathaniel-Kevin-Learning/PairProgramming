
const {User, Post, Tag, UserDetail} = require("../models")
var bcrypt = require('bcryptjs');


class Controller{
    static async landingPage(req,res){
        try {
           res.render("landing-page"); 
        } catch (error) {
            res.send(error)
        }
    }

    static async registerForm(req, res){
        try {
            let errorMessage = req.query.error;
            
            res.render("register-page", {errorMessage});
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }
    
    static async saveForm(req, res){
        try {
            let data = req.body;
            let saveUser = await User.build({
                email: data.email,
                password: data.password,
                role: data.role,
            }).validate();
            let saveDetailUser = await UserDetail.build({
                fullName: data.fullName,
                age: data.age,
                address: data.address,
                gender: data.gender,
            }).validate();

            let savedUser = await User.create({
                email: data.email,
                password: data.password,
                role: data.role,
            })

            await UserDetail.create({
                fullName: data.fullName,
                age: data.age,
                address: data.address,
                gender: data.gender,
                UserId: savedUser.id
            })
            
            res.redirect("/")
        } catch (error) {
            console.log(error)
            res.redirect(`/register?error=${error.message}`)
        }
    }

    static async loginPage(req, res){
        try {
            let error = req.query.error

            res.render("login-page", {error})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async checkLogin(req, res){
        try {
           let data = req.body;
           let emailTarget = data.email;
           let findData = await User.findAll({where:{
            email: emailTarget
           }})
       
           if (findData.length != 0) {
             let checkPassword = bcrypt.compareSync(data.password, findData[0].dataValues.password);
             if (checkPassword) {
                req.session.userId =  findData[0].dataValues.id;
                req.session.role =  findData[0].dataValues.role;
                if (findData[0].dataValues.role == "admin") {
                    res.redirect("/admins")
                }else if(findData[0].dataValues.role == "user"){
                    res.redirect("/users")
                }
             }else{
                throw new Error("Password is wrong please try again")
             }
           }else{
            throw new Error("Email not found please try again")
           }
        } catch (error) {
            console.log(error)
            res.redirect(`/login?error=${error.message}`)
        }
    }

    static async adminLandingPage(req,res){
        try {
            res.send("Hello this is admin page")
        } catch (error) {
            res.send(error.messag)
        }
    }
}

module.exports = Controller