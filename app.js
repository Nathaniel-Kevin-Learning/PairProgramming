const express = require('express');
const path = require('path');
const app = express()
const router = require('./routers');
const session = require('express-session')
const port = 3000

app.use('/photo', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        sameSite:true, 
    }
}))

app.use(router)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))