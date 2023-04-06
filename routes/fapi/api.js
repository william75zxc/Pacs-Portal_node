const express = require('express')
const router = express.Router()
const { verifyToken } = require('./auth')

router.use(verifyToken)
router.use('/user',require('../api/workuser')) //使用者管理
router.use('/patient',require('../api/patient')) //病患管理
router.use('/patientcount',require('../api/patient_count')) //病患總數

module.exports = router