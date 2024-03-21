// users.js
const express = require('express');
const Controller = require('../controller');
const router = express.Router();

const multer  = require('multer');

//Set up Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    // Define how uploaded files should be named
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

// Initialize Multer with the storage options
const upload = multer({ storage: storage });

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
router.post('/post/add', upload.single('image'), Controller.savePostForm)

module.exports = router;
