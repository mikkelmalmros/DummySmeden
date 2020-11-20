const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");
const alert = require('alert')

router.use(body.urlencoded({ extended: false }))
router.use(body.json())

//Tjek af at vi ikke får tomme strenge ind (eller strenge bestående af spaces)
const valider = /[a-zA-Z0-9]+/;

//Opretter et blueprint
router.post("/createBlueprint", async (req, res) => {
    const name = req.body.name1;
    const amount = req.body.amount1;
    const storageMin = req.body.storageMin1;
    let newBlueprint


    //Finder en liste af alle komponenter i DB ud fra ID'erne
    const components = await componentController.getComponentsById(
        req.body.dropdownComp
    );
    const blueprints = await blueprintController.getBlueprintssById(
        req.body.dropdownBP
    );

    newBlueprint = { name: name, amount: amount, storageMin: storageMin }
    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        await blueprintController.createBlueprint(
            name,
            amount,
            storageMin
        );
    } else {
        alert("Intet blev oprettet, du manglede noget data")
    }

    res.render("blueprintAmount", { theBlueprint: newBlueprint, blueprints: blueprints, components: components });
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

router.post('/amount', (req, res) => {

    // let blueprints = []
    // let body = req.body
    // let tempBlueprint
    // let mainblueprint
    // let jsonblueprint

    // for (const key of Object.keys(body)) {
    //     console.log("Value : " + body[key]);
    //     if (key.includes("mainBlueprint")) {
    //         mainblueprint = body[key]
    //         console.log("Mainblueprint : " + mainblueprint);
    //     } else if (key.includes("hidden")) {
    //         tempBlueprint = body[key]
    //         console.log("Tempblueprint : " + tempBlueprint);
    //     } else {
    //         let temp = { type: tempBlueprint._id, ref: "Blueprint", blueprintAmount: body[key] }
    //         jsonblueprint = JSON.parse(temp)
    //         console.log("Tempblueprint with amount : " + jsonblueprint);
    //     }

    // }
    //res.redirect('/')
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
router.post('/deleteBlueprint', async (req, res) => {
})

router.put('/update', (req, res) => {

    let blueprint
})

module.exports = router