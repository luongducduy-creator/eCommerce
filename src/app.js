const express = require('express')
const app= express()
const morgan = require('morgan')
const helmet = require('helmet')
//init middlewares
app.use(morgan("dev"))
// morgan("dev")
// morgan("combined")
// morgan("common")
// morgan("short")
// morgan("tiny")
app.use(helmet())
//init db

//init router
app.get('/',(req, res, next)=>{
    return res.status(200).json({
        message: 'Welcome Fantipjs'
    })
})
//handling error

module.exports = app