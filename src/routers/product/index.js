'use strict'
const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUntils')



// authentication
router.use(authentication)
////////////////////
router.post('', asyncHandler(productController.createProduct))

module.exports = router