const express = require('express')
const router = express()
const bodyParser = require('body-parser')

const User_patient = require('../../model/schedule')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.route('/')
    .post(async (req, res) => { //新增病人資訊(掛號)pid,pname,page,pgender,pidcard
        console.log(req.body)
        const { pname, page, pgender, pidcard } = req.body
        const patient_count = await User_patient.count({})
        try {
            if (!pname || !page || !pgender || !pidcard) {
                console.log('creat patient Error')
                res.status(403).json({ message: 'creat patient Error' })
            }
            else {
                console.log('creat patient seccess')
                let patient = await new User_patient({
                    id: patient_count + 1,
                    name: pname,
                    age: page,
                    gender: pgender,
                    idcard: pidcard,
                })
                patient = await patient.save()
                res.status(200).json({ message: 'creat patient seccess' })
            }
        }
        catch (err) {
            console.log(err)
            console.log('creat patient fail')
            res.status(403).json({ message: 'creat patient fail' })
        }

    })
    .get(async (req, res) => { //查詢顯示病人資訊(name查詢)
        console.log(req.query)
        const { qname } = req.query

        try {
            if (!qname) {
                const user = await User_patient.find({})
                res.status(200).json(user)
            }
            else {
                console.log("acc")
                const user = await User_patient.find({ name: { $regex: qname, $options: 'i' } })
                res.status(200).json(user)
            }

        }
        catch (err) {
            consoloe.log(err)
            console.log('query patient Error')
            res.status(403).json({message:'query patient Error'})
        }
    })

router.route('/:pid')
    .delete(async (req, res) => { //刪除病患
        console.log(req.params)
        const { pid } = req.params
        const user_count = await User_patient.count({ id: pid })
        if (user_count == 0 || !pid) {
            console.log('delete patient Error')
            res.status(403).json({ message: 'delete patient Error' })
        }
        else {
            console.log('delete user success')
            const user = await User_patient.findOneAndDelete({ id: pid })
            res.status(200).json({ message: 'delete user success' })
        }
    })
    .put(async (req, res) => { //修改病患狀態
        console.log(req.params)
        console.log(req.body)
        const { pid } = req.params
        const { Schedule } = req.body
        const user_count = await User_patient.count({})
        console.log(user_count)

        if (!pid || user_count == 0) {
            console.log('update Error')
            res.status(403).json({ message: 'update Error' })
        }
        else {
            console.log('update success')
            const user = await User_patient.findOne({ id: pid })
            user.Schedule = '抽血'
            user.save()
            console.log('update success')
            res.status(200).json({ message: 'update success' })
        }
    })

module.exports = router