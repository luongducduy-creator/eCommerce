'use strict'
const ShopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const Roleshop = {
    Shop: 'SHOP',
    Writer: 'WITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService{

    static signUp = async ({name, email, password})=>{
        try{
            //step1: check email exist
            const hodelShop = await ShopModel.findOne({ email }).lean()
            
            if (hodelShop){
                return {
                    code: 'xxxx',
                    messege: 'shop already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await ShopModel.create({
                name, email, password: passwordHash,roles: [Roleshop.SHOP]
            })
            if (newShop){
                //create private key and public key
                const {privateKey, publicKey}= crypto.generateKeyPairSync('rsa',{
                    modulusLength:4096
                })
                console.log({privateKey, publicKey})//save collection keyStore
                
                const publickeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if (!publickeyString){
                    return {
                        code: 'xxxx',
                        messege: 'public key error'
                    }
                }
                //const tokens = await 
            }
        }catch(error){
            return {
                code: 'xxx',
                messege: 'error'
            }
        }
    }
}
module.exports = new AccessService()