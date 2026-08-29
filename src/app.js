
require('dotenv').config()
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
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()
//init router
app.use('',require('./routers'))
//handling error

module.exports = app