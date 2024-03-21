// users.js
const express = require('express');
const Controller = require('../controller');
const router = express.Router();

router.use(function(req,res,next){
    if(!req.session){
        let message = "Sorry but you need to login first"
        res.redirect(`/login?error=${message}`)
    }else{
        if (req.session.role == "user" || req.session.role == "admin") {
            next()
        }else{
            let message = "Sorry but you need to login first"
            res.redirect(`/login?error=${message}`)
        }
    }
})

router.get('/', Controller.signnedHome);

router.get('/profile', Controller.userProfile)
router.get('/profile/update', Controller.updateProfileForm)
router.post('/profile/update', Controller.editProfile)

router.get('/post', Controller.showPost)
router.get('/post/add', Controller.addPostForm)

module.exports = router;
