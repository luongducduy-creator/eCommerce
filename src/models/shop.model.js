'use strict'

//!dmbg
const { model, Schema, Types}= require('mongoose');

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 150 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active','inactive'],
        default: 'inactive'
    },
    verfify: {
        type: Schema.Types.boolean,
        default: false
    },
    roles:{
        type: Array,
        default: []
    }
},{timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model('User', userSchema);