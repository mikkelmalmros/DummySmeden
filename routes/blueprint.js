const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");
const blueprintAmountController = require('../controllers/blueprintAmount')
const componentAmountController = require('../controllers/componentAmount')

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


    //Finder en liste af alle komponenter i DB ud fra ID'erne
    const components = await componentController.getComponentsById(
        req.body.dropdownComp
    );
    const blueprints = await blueprintController.getBlueprintssById(
        req.body.dropdownBP
    );

    res.render("blueprintAmount", {mainBlueprintName: pbname, amount:amount, storageMin:storageMin, blueprints: blueprints, components: components });
});


router.post('/amount', async (req, res) => {

    let blueprintName = req.body.mainBlueprintName
    let blueprintAmount = req.body.mainBlueprintAmount
    let blueprintStorageMin = req.body.mainBlueprintStorageMin

    let reqbody = req.body

    let blueprint = await blueprintController.createBlueprint(blueprintName, blueprintAmount, blueprintStorageMin)
    
    let tempBlueprint = null
    let tempComponent = null

    for (const key of Object.keys(reqbody)) {
        if (key.includes('hiddenBlueprint')) {
            tempBlueprint = await blueprintController.getBlueprintById(reqbody[key])
        } else if (key.includes('hiddenComponent')) {
            tempComponent = await componentController.getComponent(reqbody[key])
        } else if(tempBlueprint != null && key == tempBlueprint._id) {
            let amountBlueprint = await blueprintAmountController.createBlueprintAmount(tempBlueprint, reqbody[key])

            tempBlueprint = null
            blueprint.blueprints.push(amountBlueprint)
        } else if(tempComponent != null && key == tempComponent._id) {
            let amountComponent = await componentAmountController.createComponentAmount(tempComponent, reqbody[key])
            tempComponent = null
            blueprint.components.push(amountComponent)
        }
    }

    await blueprint.save()
    res.redirect('/')
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
router.post('/deleteBlueprint', async (req, res) => {

    let blueprint = req.body.dropdownDeleteBlueprint
    console.log(typeof blueprint);
    console.log(blueprint);

    //Find det blueprint vi skal slette
    let blueprintDelete = await blueprintController.getBlueprintById(blueprint)
    // Find en liste med alle blueprints
    let allBlueprints = blueprintController.getBlueprints

    // find alle blueprints og kør dem igennem for at finde ud af om deres "blueprints" indeholder 
    // noget der matcher BlueprintDelete's id.

    // dette kommer ikke til at virke når andreas pusher 20-11-2020 11:00
    /*
    for (let i = 0; i < allBlueprints.length; i++) {
        let tempBlueprint = allBlueprints[i].blueprints
        for (let j = 0; j < allBlueprints[i].blueprints.length; j++) {
            //hvis den er indeholdt i en anden så smid et allert!
            //if not delete
            if (tempBlueprint.blueprints[j]._id == blueprintDelete._id) {

                alert(blueprintDelete + " Er en del af " + tempBlueprint.blueprints[j].name)
            } else {

                blueprintController.deleteBlueprint(blueprintDelete._id)
            }

        }



    }


    res.redirect("/");
    */
})


    router.put('/update', (req, res) => {

        let blueprint
    })

    module.exports = router