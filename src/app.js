const express = require('express')
const app= express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
//init middlewares
app.use(morgan("dev"))
// morgan("dev")
// morgan("combined")
// morgan("common")
// morgan("short")
// morgan("tiny")
app.use(helmet())
app.use(compression())
//init db
require('./dbs/init.mongodb')
const { checkOverload } = require('./helpers/check.connect')
checkOverload()
//init router
app.get('/',(req, res, next)=>{
    const strCompress = 'hello Factipjs'
    return res.status(200).json({
        message: 'Welcome Fantipjs',
        metadata: strCompress.repeat(10000)
    })
})
//handling error

module.exports = app