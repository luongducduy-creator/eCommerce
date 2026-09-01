"use strict";
const AccessService = require("../services/access.service");
const { OK, Created, SuccessResponse } = require("../core/success.response");


class AccessController {
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
