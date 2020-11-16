const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blueprintSchema = Schema({
    name: String,
    amount: Number,
    components: [{ type: Schema.Types.ObjectId, ref: 'Component' }],
    blueprints: [{ type: Schema.Types.ObjectId, ref: 'Blueprint' }]
})

module.exports = mongoose.model('Blueprint', blueprintSchema)