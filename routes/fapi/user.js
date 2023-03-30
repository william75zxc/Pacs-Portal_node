//express套件
const express = require('express')
const router = express();
const jwt = require('jsonwebtoken') //josnwebtoken套件
const bcrypt = require('bcrypt'); //加密套件 
const bodyParser = require('body-parser'); //讀取POST

const User_Schema = require('../../model/username') //引入Login_Schema

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.route('/Login') //登入
    .post(async (req, res) => { //登入判斷
        console.log(req.body)
        const { email:powd, pass } = req.body
        const user = await User_Schema.findOne({ powd })

        if (!user) { //查無使用者
            console.log('Powd Error')
            res.status(401).json({ message: 'Powd Error' })
        }
        else {
            if (await bcrypt.compare(pass, user.pass)) { //密碼正確(登入成功)
                console.log('Login success')
                const accessToken = jwt.sign({ id: user.id, isername: user.name }, process.env.JWT_KEY, {
                    expiresIn: 60 * 60 * 24 * 30,
                })
                return res.cookie('accessToken', accessToken, {
                    maxAge: 60 * 60 * 24 * 30, //有效期限(單位:s)
                    secure: false,  //資料必須加密傳送 https時需開啟使用
                    httpOnly: true,  //防止網站被攻擊   
                    sameSite: true, //是否可以跨域傳送
                    
                })
                .status(200).json({ message: 'Login success', Token: accessToken })
                //return res.set('Set-cookie',`accessToken=${accessToken}`).status(200).json({ message: 'Login success', Token: accessToken })
            }
            else { //密碼錯誤
                console.log('Pass Error')
                res.status(402).json({ message: 'Pass Error' })
            }
        }

    })
    .get(async (req, res) => {
        const user = await User_Schema.count({}) //取得總資料數
        console.log(user)
        res.json({ message: `總資料筆數 : ${user} ` })
    });

router.route('/creatuser') //註冊
    .post(async (req, res) => {
        console.log(req.body)
        const { crname, crpowd, crpass } = req.body
        const user = await User_Schema.findOne({ powd: crpowd })

        try {
            if (!user) { //使用者不存
                console.log('creatuser success')
                let creatuser = await new User_Schema({
                    name: crname, 
                    powd: crpowd,
                    pass: await bcrypt.hash(crpass, 10), //加密
                    d_pass: crpass,
                })
                creatuser = await creatuser.save()
                return res.status(200).json({ message: 'creat MongoDB data' })
            }
            else { //使用者已經存在
                console.log('帳號已經存在')
                res.status(401).json({ message: 'Creat powd Error' })
            }
        }
        catch (err) { //資料輸入不完全
            //console.log(err)
            console.log('creat user Error')
            res.status(403).json({ message: 'Error MongoDB', error: err })
        }
    })

router.route('Logout')
    .post((req, res) => { //登出
        const accessToken = req.cookies.accseeToken || (req.headers['authorization'] ? req.headers['authorization'].split(' ').pop() : null)
        console.log('logout success')
        res.clearCookie('accseeToken'.status(200).json({ message: 'logout success' }))
    })

module.exports = { router }
