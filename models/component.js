const mongoose = require('mongoose')
const Schema = mongoose.Schema

const componentSchema = Schema({
    name: String,
    amount: Number,
    note: String
})

module.exports = mongoose.model('Component', componentSchema)