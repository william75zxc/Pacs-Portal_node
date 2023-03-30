require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt'); //加密套件 
const bodyParser = require('body-parser'); //讀取POST
router.use(bodyParser.urlencoded({ extended: false }));
const User_Schema = require('../../model/username') //引入Login_Schema

const verifyToken = (req,res,next) =>{
    const accessToken = req.cookies.accessToken || (req.headers['authorization'] ? req.headers['authorization'].split(' ').pop() : null)
    if(accessToken){
        jwt.verify(accessToken,process.env.JWT_KEY,(err , token) =>{
            if(err){ //憑證過期等問題
                console.log(err)
                return res.status(403).json({message: 'Invalid token'})
            }
            else{ //憑證通過
                req.token = token
                return next()
            }
        })
    }
    else{ //無憑證
        return res.status(403).json({ message: 'Need a token' }) //請求不通過
    }
}

router.post('/verify',async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken || (req.headers['authorization'] ? req.headers['authorization'].split(' ').pop() : null)
        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_KEY, async (err, token) => {
                if (err) {
                    console.log('Need a token')
                    return res.status(403).json({ message: 'Invalid token' })
                } else {
                    return res.status(200).json({ message: 'Valid token',token: accessToken })
                }
            })
        } else {
            console.log('Need a token')
            return res.status(403).json({ message: 'Need a token' })
        }
    } catch (error) {
        return res.status(403).json({ error })
    }
})

module.exports = { router, verifyToken }
