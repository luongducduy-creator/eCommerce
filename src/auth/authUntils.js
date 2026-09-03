'use strict'

const JWT = require('jsonwebtoken')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const asyncHandler = require('../helpers/asyncHandle')

//sevices
const { findByUserId }= require('../services/keyToken.service')

const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async({payload, publicKey, privateKey})=>{
    try{
        //accessToken
        const accessToken = await JWT.sign(payload,publicKey,{
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload,privateKey,{
            expiresIn: '7 days'
        })
        console.log(`accessToken::`,accessToken)
        console.log(`refreshToken::`,refreshToken)
        //
        JWT.verify( accessToken, publicKey, (err, decode)=>{
            if(err){
                console.log(`error verify::`,err)
            }else{
                console.log(`decode verify::`,decode)
            }
        })
        return {accessToken, refreshToken}
    }catch(error){
        console.error('createTokenPair error:', error)
        throw error
    }
}
const authentication = asyncHandler(async(req, res, next)=>{
    /*
        1 - check userId missing
        2 - get accessToken
        3 - verify accessToken
        4 - check user in db
        5 - check keyStore with userId
        6 - OK all => return next()
    */
    //1 
    const userId = req.headers[HEADER.CLIENT_ID]
    console.log(`userId::`, userId)
    if(!userId) throw new AuthFailureError('Invalid request')
    //2
    const keyStore = await findByUserId(userId)
    console.log(`keyStore::`, keyStore)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    console.log(`accessToken::`, accessToken)
    if(!accessToken) throw new AuthFailureError('Invalid request')
    
    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
        req.keyStore = keyStore
        return next()
    }catch(error){
        throw error
    }
})

const authenticationV2 = asyncHandler(async(req, res, next)=>{
    /*
        1 - check userId missing
        2 - get accessToken
        3 - verify accessToken
        4 - check user in db
        5 - check keyStore with userId
        6 - OK all => return next()
    */
    //1 
    const userId = req.headers[HEADER.CLIENT_ID]
    console.log(`userId::`, userId)
    if(!userId) throw new AuthFailureError('Invalid request')
    //2
    const keyStore = await findByUserId(userId)
    console.log(`keyStore::`, keyStore)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try{
        const refreshToken = req.headers[HEADER.REFRESHTOKEN]
        const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
        req.keyStore = keyStore
        req.user = decodeUser
        req.refreshToken = refreshToken
        return next()
        }catch(error){
        throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    console.log(`accessToken::`, accessToken)
    if(!accessToken) throw new AuthFailureError('Invalid request')
    
    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
        req.keyStore = keyStore
        return next()
    }catch(error){
        throw error
    }
})

const verifyJWT = async(token, keySecret)=>{
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}