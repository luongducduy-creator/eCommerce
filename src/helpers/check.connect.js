'use strict'

//countConnect
const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

//countConnect
const countConnect = () =>{
    const numConnection = mongoose.connections.length
    console.log(`Number of connection::${numConnection}`)
}

//check over load
const checkOverload = () =>{
    setInterval( () =>{
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // example maximum number of connection based on number osf cores
    const maxConnections = numCores * 5;

    console.log(`Active connection::${numConnection}`)
    console.log(`Memory usage::${memoryUsage/1024/1024}MB`)
    
    if(numConnection >maxConnections){
        console.log(`Connection overload detected!`)
        //motifi.send(....)
    }

    },_SECONDS) //Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}