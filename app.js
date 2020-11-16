// Requires
const express = require('express')
const config = require('./config')
const mongoose = require('mongoose');

//MongoDB setup
mongoose.Promise = global.Promise
mongoose.connect(config.mongoDBHost, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useUnifiedTopology: true
})
// Attributes
let port = process.env.PORT || 8080
const app = express()

app.set('view engine', 'pug')


//End points
app.get('/', (req, res) => {
    res.send('its running')
})

app.listen(port, () => {
    console.log('Serveren kører');
})