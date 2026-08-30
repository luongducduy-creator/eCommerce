'use strict'
const ShopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUntils");
const { getInfoData } = require("../utils");


const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            //step1: check email exist
            const holderShop = await ShopModel.findOne({ email }).lean()

            if (holderShop) {
                return {
                    code: 'xxxx',
                    messege: 'Shop already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await ShopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {
                //create private key and public key
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',//pkcs8
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const  privateKey = crypto.randomBytes(64).toString('hex')
                const  publicKey = crypto.randomBytes(64).toString('hex') 
                //publicKey CrytoGraphy Standard 1
                console.log({ privateKey, publicKey })//save collection keyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        messege: 'KeyStore creation error'
                    }
                }

               
                //create token pair
                const tokens = await createTokenPair( {payload: {userId: newShop._id, email, name}, publicKey, privateKey} )
                console.log(`Create Token Success::`, tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
                //const tokens = await 
            }
            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            console.error('Error in signUp:', error);
            return {
                code: 'xxx',
                messege: error.messege,
                status: 'error'
            }
        }
    }
}
module.exports = AccessService