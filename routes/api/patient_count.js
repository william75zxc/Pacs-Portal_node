const express = require('express')
const router = express()
const bodyParser = require('body-parser')

const User_patient = require('../../model/schedule')

router.route('/')
.get(async (req,res) =>{ //取得資料總筆數
    const user_count = await User_patient.count({})
    res.json(user_count)
})

module.exports = router