const express = require('express')
const router = express.Router()
const controller = require('../controllers/blueprint')
const bodyParser = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

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

    nyblueprint = { name: name, amount: amount, storageMin: storageMin, components: components, blueprints: blueprints }
    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        nyblueprint = await controller.createBlueprint(
            name,
            amount,
            storageMin,
            components,
            blueprints
        );
    } else {
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /createBlueprint");
    }
    res.render("blueprintAmount", { theBlueprint: nyblueprint, blueprints: nyblueprint.blueprints, components: nyblueprint.components });
});

router.post('/amount', (req, res) => {
    console.log(req.body.blueprint)
    let blueprints
    let components
    for (let index = 0; index < req.body.components; index++) {
        let id = components[i].id
        console.log(components[i].id)
        console.log(req.body.id)
    }
    res.redirect('/')
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