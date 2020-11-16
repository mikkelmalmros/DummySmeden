// Requires
const express = require('express')

// Attributes
let port = process.env.PORT || 8080
const app = express()

//End points
app.get('/', (req, res) => {
    res.send('Its running')
})

app.listen(port, () => {
    console.log('Serveren kører');
})