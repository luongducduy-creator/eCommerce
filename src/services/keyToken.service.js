'use strict'

const KeytokenModel = require("../models/keytoken.model")
class KeyTokenService{
    static createKeyToken = async({userId, publicKey})=>{
        try{
            const publicKeyString = publicKey.toString()
            const token = await KeytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })
            return token ? token.publicKey : null
        }catch(error){
            return error
        }
    }
}
module.exports = new KeyTokenService()