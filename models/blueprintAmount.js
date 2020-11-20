const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blueprintAmountSchema = Schema({
    
    blueprint: {type: Schema.Types.ObjectId, ref: 'Blueprint'},
    amount: Number
})

module.exports = mongoose.model('BlueprintAmount', blueprintAmountSchema)