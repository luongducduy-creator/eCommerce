'use strict'
const apikeyModel = require("../models/apiKey.model")
const crypto = require ('crypto')
const findById = async ( key ) => {
    console.log(`check`)    
    const keyhex=crypto.randomBytes(64).toString('hex');
console.log(`keyhex`,keyhex)    
    // const newKey = await apikeyModel.create({key: keyhex, permissions:'0000'})
    //  console.log(newKey)
    const objKey = await apikeyModel.findOne({key, status:true}).lean()
    return objKey
}
module.exports = {
    findById
}