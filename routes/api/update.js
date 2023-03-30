const express = require('express')
const router = express()
require('dotenv').config()
const bcrypt = require('bcrypt')
const bodyparser = require('body-parser')

const User_schema = require('../../model/username')

router.use(bodyparser.urlencoded({ extended: false }))
router.use(bodyparser.json()) 

router.route('/')
    .post(async (req, res) => {
        const {old_pass,New_pass,upname} = req.body
        console.log(req.body)
        const user = await User_schema.findOne({name:upname})

        try{
            if(!user){ //使用者不存在
                console.log('not user name')
                res.status(404).json({message:'not user name'})
            }
            else{
                const result = await bcrypt.compare(old_pass,user.pass)
                console.log(result)
                if(result == false){ //密碼不正確
                    console.log('old_pass Error')
                    res.status(401).json({message:'old_pass Error'})
                }
                else{
                    const hash = await bcrypt.hash(New_pass,10)
                    user.pass = hash
                    user.save()
                    console.log('update success')
                    res.status(200).json({message:'update success'})
                }
            }
        }
        catch(err){
            console.log('update fail')
            res.status(403).json({message:'update fail'})
        }

    })

module.exports = router