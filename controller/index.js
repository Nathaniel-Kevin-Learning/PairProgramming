
const {User, Post, Tag, PostTag, UserDetail} = require("../models")
var bcrypt = require('bcryptjs');
const {publishedDate, formatDate} = require("../helper")

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
            // console.log(error)
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
            // console.log(error)
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
            // console.log(error)
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
            // console.log(data)
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
                // console.log(error)
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
            let idUser = req.session.userId;
            let role = req.session.role;
            let deletedPostName = req.query.deleted;

            let postData = await Post.findAll({
                include:Tag,
                order: [['createdAt', 'desc']]
            })
            res.render("post", {role, postData, idUser, deletedPostName, publishedDate})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async addPostForm(req,res){
        try {
            let idTarget = req.session.userId;
            let role = req.session.role;
            let errorMessage = req.query.error;
            if (errorMessage) {
                errorMessage = errorMessage.split(',')
            }
            let tags = await Tag.findAll();
            res.render('post-add', {role, errorMessage, tags})
        } catch (error) {
            // console.log(error)
            res.send(error)
        }
    }

    static async savePostForm(req,res){
        try {
            let idTarget = req.session.userId;

            let data = req.body;
            // console.log(data)
            let imagePath
            // console.log(req.file , "data file")
            if (req.file) {
                imagePath = '/uploads/' + req.file.filename;
            }

            let newPost = await Post.create({
                title: data.title,
                shortDescription: data.shortDescription,
                image: imagePath,
                content: data.content,
                UserId: idTarget,
            })

            let tag = req.body.tag
            if (tag) {
                if (tag.length != 0) {
                    await newPost.addTags(tag);
                }
            }
            res.redirect("/users/post")
        } catch (error) {
            console.log(error)
            if (error.name == "SequelizeValidationError") {
                let msg = error.errors.map((el)=>{
                    return el.message
                })
                res.redirect(`/users/post/add?error=${msg}`)
            }else{
                res.redirect(`/users/post/add?error=${error}`)
            }
        }
    }

    static async postDetails(req,res){
        try {
            let idTarget = req.session.userId;
            let role = req.session.role;
            let idPost = req.params.id;
            // console.log(req.params.id, "data ID UNTUK POST")
            let dataPostDetail = await Post.findAll({
                include:[
                    { model: User,
                      include: UserDetail
                    },
                    { model: Tag }
                ],
                where: {
                    id: idPost
                }
            })
            // res.send(dataPostDetail)
            res.render("post-detail", {role, dataPostDetail, formatDate})
        } catch (error) {
            // console.log(error)
            res.send(error.message)
        }
    }

    static async deletePost(req, res){
        try {
            let idPost = req.params.id;
            let post = await Post.findByPk(idPost)

            await post.setTags([])
            let deletedPostName = post.title
            await post.destroy();

            res.redirect(`/users/post?deleted=${deletedPostName}`)
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller