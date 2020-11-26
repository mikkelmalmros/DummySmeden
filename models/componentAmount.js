const mongoose = require('mongoose')
const Schema = mongoose.Schema

const componentAmountSchema = Schema({
    
    component: {type: Schema.Types.ObjectId, ref: 'Component'},
    amount: Number
})

module.exports = mongoose.model('ComponentAmount', componentAmountSchema)