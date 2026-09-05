"use strict";
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");
const { SuccessResponse } = require("../core/success.response");
const { product } = require("../models/product.model");


class ProductController {

  // createProduct = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: 'Create new success!',
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId
  //     })
  //   }).send(res)

  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'publishProductByShop success!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }


   unPublishProductByShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'unPublishProductByShop success!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }



  /// QUERY///
  /**
   * @desc Get all Drafts for shop
   * @param {number} limit 
   * @param {number} skip
   * @return {JSON}  
   */
  getAllDraftsForShop = async (req, res, next) =>{
    new SuccessResponse({
      message: 'Get list Draft success!',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId
    })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) =>{
    new SuccessResponse({
      message: 'Get list Publish success!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId
    })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) =>{
    new SuccessResponse({
      message: 'getListSearchProduct success!',
      metadata: await ProductServiceV2.searchProduct(req.params)
    }).send(res)
  }

   findAllProducts = async (req, res, next) =>{
    new SuccessResponse({
      message: 'findAllProducts success!',
      metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
  }

  findProducts = async (req, res, next) =>{
    new SuccessResponse({
      message: 'findAllProducts success!',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }

  ///END QUERY///
}
module.exports = new ProductController();
