// Requires
const express = require('express')
const config = require('./config')
const mongoose = require('mongoose');
const body = require("body-parser")
const componentController = require('./controllers/component')
const blueprintController = require('./controllers/blueprint')

// Til test - Skal slettes senere
const Blueprint = require('./models/blueprint')
const Component = require('./models/component')

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

app.use('/static', express.static('public'))

app.use(body.json())
app.use(body.urlencoded({ extended: false }))

//Dummy-data
// Opsætning af dummy blueprints
// blueprintController.createBlueprint("Dims1", 10)
// blueprintController.createBlueprint("Dims2", 5)
// let second = Blueprint({ name: "Dims3", amount: 1 })
// second.save()
// let first = Blueprint({ name: "Dims4" })
// first.save()
// blueprintController.addBlueprintToBlueprint(first, second)
// component = Component({
//     name: 'testKomp',
//     amount: 100,
//     description: 'En testkomponent',
//     storageMin: 10
// })
// component.save()

//End points
app.get('/', async (req, res) => {
    const components = await componentController.getComponents()
    const blueprints = await blueprintController.getBlueprints()
    res.render('storage', { components: components, blueprints: blueprints })
})

// DER SKAL LAVES CHECKS PÅ TOMME STRENGE
app.post('/createComponent', async (req, res) => {
    const name = req.body.name2
    const amount = req.body.amount2
    const description = req.body.description2
    const storageMin = req.body.storageMin2
    await componentController.createComponent(name, amount, description, storageMin)
    res.redirect('/')
})

app.post('/createBlueprint', async (req, res) => {
    const name = req.body.name1
    const amount = req.body.amount1
    //Finder en liste af alle komponenter i DB ud fra ID'erne
    const components = await componentController.getComponentsById(req.body.dropdownComp)
    const blueprints = await blueprintController.getBlueprintssById(req.body.dropdownBP)
    await blueprintController.createBlueprint(name, amount, components, blueprints)
    res.redirect('/')
})

// DERUDOVER TÆNKER JEG DEN SKAL LAVES OM TIL EN PUT I STEDET FOR POST?
// DER SKAL LAVES CHECKS PÅ TOMME STRENGE
app.post('/updateComponent', async (req, res) => {
    const componentID = req.body.dropdownComponents
    const component = await componentController.getComponent(componentID)
    const amount = req.body.updateamount
    await componentController.updateAmount(component, amount)
    res.redirect('/')
})

app.post('/deleteComponent', async (req, res) => {
    const componentID = req.body.dropdownDelete
    const component = await componentController.getComponent(componentID)
    await componentController.deleteComponent(component)
    res.redirect('/')
})

//Start server
app.listen(port, () => {
    console.log('Serveren kører');
})