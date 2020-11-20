const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");

const AmountBlueprint = require('../models/blueprintAmount')
const Blueprint = require('../models/blueprint')

router.use(body.urlencoded({ extended: false }))
router.use(body.json())

//Tjek af at vi ikke får tomme strenge ind (eller strenge bestående af spaces)
const valider = /[a-zA-Z0-9]+/;

//Opretter et blueprint
router.post("/createBlueprint", async (req, res) => {
    const pbname = req.body.name1;
    console.log("1. name : " + pbname);
    const amount = req.body.amount1;
    console.log("1. amount : " + amount);
    const storageMin = req.body.storageMin1;
    console.log("1. StorageMin : " + storageMin);
    // const components = req.body.dropdownComp
    // const blueprints = req.body.dropdownBP
    
    // let newBlueprint


    //Finder en liste af alle komponenter i DB ud fra ID'erne
    const components = await componentController.getComponentsById(
        req.body.dropdownComp
    );
    const blueprints = await blueprintController.getBlueprintssById(
        req.body.dropdownBP
    );

    // newBlueprint = { name: name, amount: amount, storageMin: storageMin }
    // if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
    //     await blueprintController.createBlueprint(
    //         name,
    //         amount,
    //         storageMin
    //     );
    // } else {
    //     //Vis pæn besked til brugeren
    //     console.log("Forkerte værdier i /createBlueprint");
    // }

    res.render("blueprintAmount", {mainBlueprintName: pbname, amount:amount, storageMin:storageMin, blueprints: blueprints, components: components });
});


router.post('/amount', async (req, res) => {

    let blueprintName = req.body.mainBlueprintName
    console.log("Name: " + blueprintName);
    let blueprintAmount = req.body.mainBlueprintAmount
    console.log("Amount: " + blueprintName);
    let blueprintStorageMin = req.body.mainBlueprintStorageMin
    console.log("StorageMin: " + blueprintName);

    let body = req.body

    const components = await componentController.getComponentsById(
        req.body.dropdownComp
    );
    const blueprints = await blueprintController.getBlueprintssById(
        req.body.dropdownBP
    );

    let blueprint = Blueprint({name:blueprintName, amount:blueprintAmount, storageMin:blueprintStorageMin})
    
    let amountBlueprints = []
    let amountComponent = []

    let tempBlueprint = null
    let tempComponent = null

    for (const key of Object.keys(body)) {
        console.log(key + " -> " + body[key]);
        console.log("Key test på 'hiddenBlueprint : " + key.includes('hiddenBlueprint'));
        if (key.includes('hiddenBlueprint')) {
            tempBlueprint = await blueprintController.getBlueprintById(body[key])
        } else if(tempBlueprint != null && key == tempBlueprint._id) {
            let amountBlueprint = AmountBlueprint({blueprint:JSON.stringify(tempBlueprint), amount:body[key]})
            tempBlueprint = null
            //await amountBlueprint.save()
            blueprint.blueprints.push(amountBlueprint)
        }
    }

    console.log("The blueprint : " + blueprint);
    res.redirect('/')
    return await blueprint.save()
    
})

router.get('/amount', (req, res) => {
})


//Adds a component to a blueprint
router.post('/addComponent', (req, res) => {
    blueprintController.addComponentToBluePrint(req.body.blueprint, req.body.components)
})

//Adds a blueprint to a blueprint
router.post('/addBlueprint', (req, res) => {
    blueprintController.addBlueprintToBlueprint(req.body.firstBlueprint, req.body.secondBlueprint)
})

//Delete blueprint
router.delete('/delete', (req, res) => {

    let blueprint = req.body.blueprint

    if (!blueprint) {
        return res
            .status(404)
            .json({ error: 'Blueprint not found' })
    }
    blueprintController.deleteBlueprint(req.body.blueprint)
})

router.put('/update', (req, res) => {

    let blueprint
})

module.exports = router