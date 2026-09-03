"use strict";
const AccessService = require("../services/access.service");
const { OK, Created, SuccessResponse } = require("../core/success.response");


class AccessController {

  handlerRefreshToken = async (req, res, next) => {
   
    // new SuccessResponse({
    //   message: 'Get token success!',
    //   metadata: await AccessService.handleRefreshToken( req.body.refreshToken)
    // }).send(res)
    //v2 fixed, no need accessToken
    new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }


  logout = async (req, res, next) => {
   
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout( req.keyStore)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
        metadata: await AccessService.login(req.body)
    }).send(res)
  }
  signUp = async (req, res, next) => {
    // return res.status(200).json({
    //   mesage: '',
    //   metadata:
    // })
      new Created({
        message: "Register success",
        metadata: await AccessService.signUp(req.body),
        options: {
          limit: 10
        }
      }).send(res)
      //  return res.status(201).json(await AccessService.signUp(req.body))
        // message: "Signup successfully",
        // data: {
        //   name: "Shop TIPS",
        //   email: "shoptipjs@gmail.com",
        //},
    //   });
  };
}
module.exports = new AccessController();
