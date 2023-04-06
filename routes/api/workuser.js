const express = require('express')
const router = express()
require('dotenv').config()
const bcrypt = require('bcrypt')
const bodyparser = require('body-parser')

const User_Schema = require('../../model/username')

router.route('/')
.get(async (req,res) =>{ //查詢使用者
    console.log(req.query)
        const { qname } = req.query

        try{
            if(!qname){
                const user = await User_Schema.find({})
                res.status(200).json(user)
            }
            else{
                const user = await User_Schema.find({name:{$regex:qname,$options:'i'}})
                res.status(200).json(user)
            }
        }
        catch(err){
            console.log(err)
            console.log('query user Error')
            res.status(403).json({message:'query user Error'})
        }
})

router.route('/:id')
.delete(async (req,res) =>{ //刪除使用者
    try{
        console.log(req.params)
        const {id} = req.params
        const user = await User_Schema.count({id:id})
        console.log(user)
        if(!id || user == 0){
            console.log('delete id Error')
            res.status(404).json({message:'delete id Error'})
        }
        else{
            console.log('delete user success')
            const user = await User_Schema.findOneAndDelete({name:id})
            res.status(200).json({message:'delete user success'})
        }
    }
    catch(err){
        console.log(err)
        res.status(404).json({message:'delete fail'})
    }
})
.put(async (req,res) =>{ //修改使用者
    const {old_pass,New_pass,upname} = req.body
    console.log(req.body)
    const user = await User_Schema.findOne({name:upname})

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
