// users.js
const express = require('express');
const router = express.Router();

router.use(function(req,res,next){
    if(!req.session){
        let message = "Sorry but you need to login first"
        res.redirect(`/login?error=${message}`)
    }else{
        console.log("Hit user")
        console.log(req.session)
        if (req.session.role == "user") {
            next()
        }else{
            res.redirect(`/admins`)
        }
    }
})

router.get('/', (req, res) => {
  res.send('Users Page');
});

module.exports = router;
