'use strict'
const {
    getSelectData, unGetSelectData
} = require('../../utils')

const findAllDiscountCodesUnSelect = async({
    limmit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page-1) * limit;
    const sortBy = sort === 'ctime' ? {_id:-1}:{_id:1}
    const documents = await product.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return documents
}

const findAllDiscountCodesSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, Select, model
}) => {
    const skip = (page-1) * limit;
    const sortBy = sort === 'ctime' ? {_id:-1}:{_id:1}
    const documents = await product.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(GetSelectData(Select))
    .lean()

    return documents
}

const checkDiscountExist = async (model, filter) => {
    return model.findOne(filter).lean()
}

module.exports ={
    findAllDiscountCodesUnSelect,
    checkDiscountExist,
    findAllDiscountCodesSelect
}