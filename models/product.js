const mogoose = require('mongoose')
const Schema = mogoose.Schema

const productSchema = Schema({
    name: String,
    amount: Number,
    note: String,
    blueprints: [{
        type: Schema.Types.ObjectId, ref: 'BlueprintAmount'
    }]
})

module.exports = mogoose.model('Product', productSchema)