const express = require('express')
const router = express.Router()
const { verifyToken } = require('./auth')

router.use(verifyToken)
router.use('/query',require('../api/query')) //查詢
router.use('/delete',require('../api/delete')) //刪除
router.use('/update',require('../api/update')) //修改密碼
router.use('/patient',require('../api/patient')) //病患管理
router.use('/patientcount',require('../api/patient_count')) //病患總數

module.exports = router