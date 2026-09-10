'use strict'

const _=require('lodash')

const getInfoData = ({fileds=[], object={}})=>{
    return _.pick(object, fileds)
}
//['a', 'b'] = {a: 1, b: 1}
const getSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el=> [el, 1]))
}

//['a', 'b'] = {a: 0, b: 0}
const unGetSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el=> [el, 0]))
}

const removeUndefinedObject = obj =>{
    Object.keys(obj).forEach(k =>{
        if(obj [k] == null){
            delete obj[k]
        }
    })

    return obj
}


/*
    const a = {
        c:{
            d: 1,
            e: 2
        }
    }

    db.collection.updateOne({
        `c.d`: 1
    })
*/
const updateNestedObjectParser = obj =>{
    console.log(`[1]::`,obj)
    const final = {}
        Object.keys(obj).forEach(k =>{
            if(typeof obj[k]==='object'&&!Array.isArray(obj[k])){
                const respone = updateNestedObjectParser(obj[k])
                Object.keys(respone).forEach(a =>{
                    final[`${k}.${a}`]= respone[a]
                })
            }else{
                final[k]= obj[k]
            }
        })
        console.log(`[2]::`,obj)
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}