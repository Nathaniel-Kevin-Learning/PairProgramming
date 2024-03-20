const router = require('express').Router()


router.use(function(req,res,next){
    if(!req.session){
        let message = "Sorry but you need to login first"
        res.redirect(`/login?error=${message}`)
    }else{
        console.log("Hit admins")
        console.log(req.session, "session")
        if (req.session.role == "admin") {
            next()
        }else{
            res.redirect(`/users`)
        }
    }
})

router.get('/', (req,res)=>{
    res.send("Hello this is admin page")
});


module.exports  = router