const express = require('express')
const router = express()
const bodyParser = require('body-parser');

const User_schema = require('../../model/username')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.route('/:dname')
    .delete(async (req, res) => {
        try{
            console.log(req.params)
            const {dname} = req.params
            const user = await User_schema.count({name:dname})
            console.log(user)
            if(!dname || user == 0){
                console.log('delete name Error')
                res.status(404).json({message:'delete name Error'})
            }
            else{
                console.log('delete user success')
                const user = await User_schema.findOneAndDelete({name:dname})
                res.status(200).json({message:'delete user success'})
            }
        }
        catch(err){
            console.log(err)
            res.status(404
                ).json({message:'delete fail'})
        }
    })

module.exports = router