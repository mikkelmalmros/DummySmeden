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

    res.render("blueprintAmount", { mainBlueprintName: pbname, amount: amount, storageMin: storageMin, blueprints: blueprints, components: components });
});

router.post("/updateBlueprint", async (req, res) => {
    const blueprintID = req.body.dropdownBlueprints;
    const blueprint = await blueprintController.getBlueprintById(blueprintID);
    const amount = req.body.updateamount;
    const name = req.body.updatename;
    const minimum = req.body.updatemin;

    if (valider.test(amount)) {
        await blueprintController.updateAmount(blueprint, amount);
    }

    if (valider.test(name)) {
        await blueprintController.updateName(blueprint, name);
    }

    if (valider.test(minimum)) {
        await blueprintController.updatestorageMin(blueprint, minimum);
    }

    if (!valider.test(amount) && !valider.test(name) && !valider.test(minimum)) {
        alert("Du har ikke indtastet noget data")
    }
    res.redirect("/");
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
        } else if (tempBlueprint != null && key == tempBlueprint._id) {
            let amountBlueprint = await blueprintAmountController.createBlueprintAmount(tempBlueprint, reqbody[key])

            tempBlueprint = null
            blueprint.blueprints.push(amountBlueprint)
        } else if (tempComponent != null && key == tempComponent._id) {
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


    //Find det blueprint vi skal slette
    let blueprintDelete = await blueprintController.getBlueprintById(blueprint)
    // Find en liste med alle blueprints
    let allBlueprints = await blueprintController.getBlueprints


    check = await blueprintController.findBlueprintInBlueprint(blueprintDelete)
    if (check == "intet") {
        blueprintController.deleteBlueprint(blueprintDelete)
        res.redirect("/");
    } else {
        console.log("lav et conferm alert" + " og slet: ");
        console.log(check.name);
    }


})


router.put('/update', (req, res) => {

    let blueprint
})

module.exports = router