'use strict'

const KeytokenModel = require("../models/keytoken.model")
class KeyTokenService{
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken})=>{
        try{
            //level 0
            // const publicKeyString = publicKey.toString()
            // const token = await KeytokenModel.create({
            //     user: userId,
            //     // publicKey: publicKeyString
            //     publicKey,
            //     privateKey
            // })
            // return token ? token.publicKey : null
            // 
            
            //level xxx
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            },options = {upsert: true, new: true}
            const token = await KeytokenModel.findOneAndUpdate(filter, update, options)

            return token ? token.publicKey : null
        }catch(error){
            return error
        }
    }
}
module.exports = KeyTokenService