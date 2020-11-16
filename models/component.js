const mongoose = require('mongoose')
const Schema = mongoose.Schema

const componentSchema = Schema({
    name: String,
    amount: Number,
    description: String,
    storageMin: Number
})

module.exports = mongoose.model('Component', componentSchema)