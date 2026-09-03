'use strict'

const KeytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')
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

    static findByUserId = async(userId)=>{
        return await KeytokenModel.findOne({user: new Types.ObjectId(userId)})
    }
    static removeKeyById = async(id)=>{
        return await KeytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }

    static findByRefreshTokenUsed = async(refreshToken)=>{
        return await KeytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async(refreshToken)=>{
        return await KeytokenModel.findOne({refreshToken})
    }

    static deleteKeyById = async( userId)=>{
        return await KeytokenModel.deleteOne({user: new Types.ObjectId(userId)})
    }
        // Cập nhật khóa token theo ID
    static updateKeyToken = async(id, updateData)=>{
        return await KeytokenModel.findByIdAndUpdate(id, updateData, {new: true})
    }
} 
module.exports = KeyTokenService