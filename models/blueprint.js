const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blueprintSchema = Schema({
    name: String,
    amount: Number,
    note: String,
    components: [{
        type: Schema.Types.ObjectId, ref: 'ComponentAmount'
    }],
    blueprints: [{
        type: Schema.Types.ObjectId, ref: 'BlueprintAmount'
    }]
})

module.exports = mongoose.model('Blueprint', blueprintSchema)