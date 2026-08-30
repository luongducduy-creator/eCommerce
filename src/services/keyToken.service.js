'use strict'

const KeytokenModel = require("../models/keytoken.model")
class KeyTokenService{
    static createKeyToken = async({userId, publicKey, privateKey})=>{
        try{
            // const publicKeyString = publicKey.toString()
            const token = await KeytokenModel.create({
                user: userId,
                // publicKey: publicKeyString
                publicKey,
                privateKey
            })
            return token ? token.publicKey : null
        }catch(error){
            return error
        }
    }
}
module.exports = KeyTokenService