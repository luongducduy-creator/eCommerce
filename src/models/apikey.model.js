'use strict'


const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'apikey'
const COLLECTION_NAME = 'apikey'
// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:boolean,
        default:true,
    },
    permissions:{
        type:String,
        required:true,
        enum:['0000','1111','2222']
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: '30d', // 30 days
    },
},{
    timestamps:true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);