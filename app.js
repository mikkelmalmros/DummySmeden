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

//Tjek af at vi ikke får tomme strenge ind (eller strenge bestående af spaces)
const valider = /[a-zA-Z0-9]+/

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
    const storageMin = req.body.storageMin2
    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        await componentController.createComponent(name, amount, storageMin)
    } else {
        console.log('Forkerte værdier i /createComponent');
    }
    res.redirect('/')
})

app.post('/createBlueprint', async (req, res) => {
    const name = req.body.name1
    const amount = req.body.amount1
    const storageMin = req.body.storageMin1
    //Finder en liste af alle komponenter i DB ud fra ID'erne
    const components = await componentController.getComponentsById(req.body.dropdownComp)
    const blueprints = await blueprintController.getBlueprintssById(req.body.dropdownBP)
    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        await blueprintController.createBlueprint(name, amount, storageMin, components, blueprints)
    } else {
        console.log('Forkerte værdier i /createBlueprint');
    }
    res.redirect('/')
})

// DERUDOVER TÆNKER JEG DEN SKAL LAVES OM TIL EN PUT I STEDET FOR POST?
// DER SKAL LAVES CHECKS PÅ TOMME STRENGE
app.post('/updateComponent', async (req, res) => {
    const componentID = req.body.dropdownComponents
    const component = await componentController.getComponent(componentID)
    const amount = req.body.updateamount
    const name = req.body.updatename
    const minimum = req.body.updatemin
    if (amount != null && amount != undefined)
        await componentController.updateAmount(component, amount)
    if (name != null && name != undefined)
        await componentController.updateName(component, name)
    if (minimum != null && minimum != undefined)
        await componentController.updateMininum(component, minimum)
    res.redirect('/')
})

app.post('/deleteComponent', async (req, res) => {
    const componentID = req.body.dropdownDelete
    await componentController.deleteComponent(componentID)
    res.redirect('/')
})

//Start server
app.listen(port, () => {
    console.log('Serveren kører');
})