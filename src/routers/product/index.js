'use strict'
const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const { authenticationV2 } = require('../../auth/authUntils')


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProducts))

// authentication
router.use(authenticationV2)
////////////////////
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/publish/:id', asyncHandler(productController.unPublishProductByShop))

//QUERY//
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/unpublished/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router