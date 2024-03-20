const Controller = require('../controller');
const router = require('express').Router();


router.use(function(req,res,next){
    console.log(req.session, "dari middleware")
    next()
})

router.get('/', Controller.landingPage);

router.get('/register', Controller.registerForm)
router.post('/register', Controller.saveForm)

router.get('/login', Controller.loginPage)
router.post('/login', Controller.checkLogin)

router.get('/check', (req,res)=>{
    console.log(req.session)
    res.send(req.session)
})


router.use('/users', require('./users'));
router.use('/admins', require('./admin'));


module.exports  = router