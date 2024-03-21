
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

    static async logout(req,res){
       req.session.destroy((err)=>{
            if (err) {
                res.send(err) 
            }else{
                res.redirect('/')
            }
       }) 
    }

    static async signnedHome(req,res){
        try {
            let role = req.session.role
            res.render("signned-home", {role})
        } catch (error) {
            res.send(error)
        }
        
    }

    static async userProfile(req,res){
        try {
            let id = req.session.userId
            let role = req.session.role
            // console.log(role)

            let dataUser = await User.findByPk(id, {
                attributes:['email'],
                include: UserDetail 
            })
            // console.dir(dataUser, {depth:10})
            console.log(dataUser)
            res.render('user-profile', {role, dataUser});
        } catch (error) {
            res.send(error);
        }
    }

    static async updateProfileForm(req, res){
        try {
            let idTarget = req.session.userId
            let role = req.session.role
            let errorMessage = req.query.error;
            if (errorMessage) {
                errorMessage = errorMessage.split(',')
            }
            let data = await UserDetail.findAll({where:{
                UserId: idTarget
            }})

            console.log(data)
            res.render("update-profile",{role, errorMessage, data})
        } catch (error) {
            res.send(error)
        }
    }

    static async editProfile(req,res){
        try {
            let idTarget = req.session.userId;
            let newData = req.body;

            let data = await UserDetail.findAll({where:{
                UserId: idTarget
            }})
            console.log(data)
            await UserDetail.update({ 
                fullName: newData.fullName,
                address: newData.address,
                gender: newData.gender,
                age: newData.age
            }, {
                where: {
                  id: data[0].id
                }
              });
            res.redirect('/users/profile');
        } catch (error) {
            if (error.name == 'SequelizeValidationError') {
                res.redirect(`/users/profile/update?error=${error.errors.message}`)
            }else{
                console.log(error)
                res.send(error)
            }
        }
    }

    static async showUserList(req,res){
        try {
            let idTarget = req.session.userId;
            let role = req.session.role;
            let search = req.query.search
            let data = await User.findAllUsers(UserDetail, search)
            res.render('user-list', {role, data})
        } catch (error) {
            res.send(error)
        }
    }

    static async showPost(req,res){
        try {
            let idTarget = req.session.userId;
            let role = req.session.role;

            res.render("post", {role})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async addPostForm(req,res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller