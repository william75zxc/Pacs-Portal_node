const express = require('express')
const router = express()
require('dotenv').config() //env
const path = require('path') //讀檔
const cors = require('cors') //跨網
const morgan = require('morgan') //查看接收
const cookieParser = require('cookie-parser') //cookie
const mongoose = require('mongoose') //Mongodb

const acc = "acc"

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//跨網域連接
router.use(cors({ credentials: true, origin: process.env.WEB_ORIGIN_URL }));
router.use(morgan('dev'))

//使用資料夾權限
router.use(express.static('public')); 
router.use(express.static('model')); 
router.use(express.static('routes'));
//cookie
router.use(cookieParser());
router.use(express.static(path.resolve(__dirname,'./public/build'))); //開啟靜態檔

//連接MongoDB
mongoose.connect(process.env.MONGODB_SERVER)
.then(acc =>{ //連接成功
    console.log('MongoDB連接成功')
})
.catch(err =>{
    console.log(`MongoDB Error${err}`)
})

const { router: UserRouter } = require("./routes/fapi/user"); //登入,註冊,忘記密碼
const { router: authRouter } = require("./routes/fapi/auth"); //驗證cookie

router.use('/user',UserRouter) //登入,註冊,忘記密碼
router.use('/auth',authRouter); //驗證cookie
router.use('/api',require("./routes/fapi/api")) //功能

router.get("*",(req,res) =>{
    res.sendFile(path.resolve(__dirname,"./static/build","index.html"))
})

const port = process.env.SERVER_PORT
router.listen(port,() =>{
    console.log(`連接成功 ${port}`)
})