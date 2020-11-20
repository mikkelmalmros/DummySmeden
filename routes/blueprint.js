const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");

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
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /createBlueprint");
    }

    res.render("blueprintAmount", { theBlueprint: newBlueprint, blueprints: blueprints, components: components });
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
})
*/

    router.put('/update', (req, res) => {

        let blueprint
    })

    module.exports = router