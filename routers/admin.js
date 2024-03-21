const Controller = require('../controller')

const router = require('express').Router()


router.use(function(req,res,next){
    if(!req.session){
        let message = "Sorry but you need to login first"
        res.redirect(`/login?error=${message}`)
    }else{
        if (req.session.role == "admin") {
            next()
        }else if (req.session.role == "user"){
            res.redirect(`/users`)
        }else{
            let message = "Sorry but you need to login first"
            res.redirect(`/login?error=${message}`)
        }
    }
})

router.get('/', Controller.signnedHome);
router.get('/userList', Controller.showUserList);


module.exports  = router