const express = require('express')
const router = express.Router()
const controller = require('../controllers/blueprint')
const bodyParser = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//Globale variable
let globalBlueprints
let globalComponents

//Tjek af at vi ikke får tomme strenge ind (eller strenge bestående af spaces)
const valider = /[a-zA-Z0-9]+/;

//Opretter et blueprint
router.post("/createBlueprint", async (req, res) => {
    const name = req.body.name1;
    const amount = req.body.amount1;
    const storageMin = req.body.storageMin1;
    let nyblueprint


    //Finder en liste af alle komponenter i DB ud fra ID'erne
    const components = await componentController.getComponentsById(
        req.body.dropdownComp
    );
    const blueprints = await blueprintController.getBlueprintssById(
        req.body.dropdownBP
    );

    nyblueprint = { name: name, amount: amount, storageMin: storageMin }
    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        await controller.createBlueprint(
            name,
            amount,
            storageMin
        );
    } else {
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /createBlueprint");
    }
    globalBlueprints = nyblueprint.blueprints
    globalComponents = nyblueprint.components

    res.render("blueprintAmount", { theBlueprint: nyblueprint, blueprints: blueprints, components: components });
});


router.post('/amount', (req, res) => {
    let blueprints = []
    let body = req.body
    let tempBlueprint
    let mainblueprint
    let jsonblueprint

    for (const key of Object.keys(body)) {
        console.log("Value : " + body[key]);
        if (key.includes("mainBlueprint")) {
            mainblueprint = body[key]
            console.log("Mainblueprint : " + mainblueprint);
        } else if (key.includes("hidden")) {
            tempBlueprint = body[key]
            console.log("Tempblueprint : " + tempBlueprint);
        } else {
            let temp = { type: tempBlueprint._id, ref: "Blueprint", blueprintAmount: body[key] }
            jsonblueprint = JSON.parse(temp)
            console.log("Tempblueprint with amount : " + jsonblueprint);
        }

    }



    // for (let blueprint of globalBlueprints) {
    //     let inputName = blueprint.name
    //     amount = req.body.inputName
    //     let json = { type: blueprint._id, ref: 'Blueprint', blueprintAmount: amount }
    //     blueprints.push(json)
    //     console.log(blueprints)
    // }



    //res.redirect('/')
})

router.get('/amount', (req, res) => {
})


//Adds a component to a blueprint
router.post('/addComponent', (req, res) => {
    controller.addComponentToBluePrint(req.body.blueprint, req.body.components)
})

//Adds a blueprint to a blueprint
router.post('/addBlueprint', (req, res) => {
    controller.addBlueprintToBlueprint(req.body.firstBlueprint, req.body.secondBlueprint)
})

//Delete blueprint
router.delete('/delete', (req, res) => {

    let blueprint = req.body.blueprint

    if (!blueprint) {
        return res
            .status(404)
            .json({ error: 'Blueprint not found' })
    }
    controller.deleteBlueprint(req.body.blueprint)
})

router.put('/update', (req, res) => {

    let blueprint
})

module.exports = router