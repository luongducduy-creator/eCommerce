'use Strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const { findById } = require ('../services/apikey.service')

const apiKey =(req, res, next)=>{
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        //check objKey
        const objKey = await findById(key)
        if (!objkey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()
    }catch(error){

    } 
}


module.exports ={
    apiKey
}