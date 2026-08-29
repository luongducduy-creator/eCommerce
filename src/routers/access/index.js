'use strict'
const express = require('express')
const router = express.Router()



//sightUp
router.post('/shop/signup',AccessController.signUp)




module.exports = router