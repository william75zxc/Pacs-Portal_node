const express = require('express')
const router = express()
const bodyParser = require('body-parser')

const User_Schema = require('../../model/username')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.route('/')
    .get(async (req, res) => {
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
            consoloe.log(err)
            console.log('query user Error')
            res.status(403).json({message:'query user Error'})
        }
          
    })

module.exports = router