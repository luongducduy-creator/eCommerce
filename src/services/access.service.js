'use strict'
const ShopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUntils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, ForbiddenError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");




const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {

    static handleRefreshTokenV2 = async( {keyStore,user,refreshToken} )=>{
        const { userId, email } = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('something wrong happend, pls relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered ')
        
        const foundShop = await findByEmail( {email} )
        if(!foundShop) throw new AuthFailureError('Shop not registered 2')
        //create 1 cap moi
        const tokens = await createTokenPair( {payload: {userId, email }, publicKey: keyStore.publicKey, privateKey: keyStore.privateKey} )

        //update token
        await KeyTokenService.updateKeyToken(keyStore._id, {
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });
        return {
            user,
            tokens
        }
    }

    /*
         check this token used?
    */
    static handleRefreshToken = async( refreshToken )=>{

        //check xem token nay da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed( refreshToken ) 
        //neu da duoc su dung 
        if(foundToken) {
            //decode xem may la thang nao??
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email})
            //xoa tat ca token trong keyStore 
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('something wrong happend, pls relogin')
        }

        //NO, qua ngon
        const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
        if(!holderToken) throw new AuthFailureError('Shop not registered 1')
  
        //verify token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--',{userId, email})
        //check userId
        const foundShop = await findByEmail( {email} )
        if(!foundShop) throw new AuthFailureError('Shop not registered 2')

        //create 1 cap moi
        const tokens = await createTokenPair( {payload: {userId, email }, publicKey: holderToken.publicKey, privateKey: holderToken.privateKey} )

        //update token
        await KeyTokenService.updateKeyToken(holderToken._id, {
            refreshToken: tokens.refreshToken,
            $addToSet: {refreshTokensUsed: refreshToken}
        })
        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async ( keyStore )=>{
         console.log(`delete keyStore::`)
        const delKey = await KeyTokenService.removeKeyById( keyStore._id)
        console.log(`delete keyStore::`, delKey)
        return delKey
    }
     /*
        1. check email in database
        2. match password
        3. create accessToken, refreshToken
        4. generate tokens
        5. get data return login
    */
    static login = async ({ email, password, refreshToken = null })=>{
        //1.
        const foundShop = await findByEmail({ email})
        if(!foundShop) throw new BadRequestError('Shop not registered')
        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error ')
        //3.
        const  privateKey = crypto.randomBytes(64).toString('hex')
        const  publicKey = crypto.randomBytes(64).toString('hex')
        //4.
        const {_id: userId} = foundShop
        const tokens = await createTokenPair( {payload: {userId, email }, publicKey, privateKey} )

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey,userId
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // try {
            //step1: check email exist
            const holderShop = await ShopModel.findOne({ email }).lean()

            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered')
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
                    //throw new BadRequestError('Error: KeyStore already registered')
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
        // } catch (error) {
        //     console.error('Error in signUp:', error);
        //     return {
        //         code: 'xxx',
        //         messege: error.messege,
        //         status: 'error'
        //     }
        // }
    }
}
module.exports = AccessService