'use strict'

const express = require ('express')
const router = express.Router()
const {apiKey} = require('../auth/checkAuth')
//check apiKey
router.use(apiKey)
//check permission 

router.use('/v1/api',require('./access'))
// router.get('',(req, res, next)=>{
//     return res.status(200).json({
//         message: 'Welcome Fantipjs',
//     })
// })


module.exports = router