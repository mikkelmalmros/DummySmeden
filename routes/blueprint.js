const express = require('express')
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

//The first step in creating a blueprint - the creation happens in the endpont "/amount"
router.post("/createBlueprint", async (req, res) => {
    if (req.session.isLoggedIn) {
        const pbname = req.body.inputBPName;
        const amount = req.body.inputBPAmount;
        const note = req.body.inputBPNote;
        if (valider.test(pbname) || valider.test(amount) || valider.test(note)) {
            const components = await componentController.getComponentsById(req.body.dropdownComp);
            res.render("blueprintAmount", { mainBlueprintName: pbname, amount: amount, note: note, components: components });
        } else {
            console.log("der manger name, amount eller storageMin");
        }

    } else {
        res.redirect('/login')
    }

});

router.post('/amount', async (req, res) => {
    if (req.session.isLoggedIn) {


        let blueprintName = req.body.mainBlueprintName
        let blueprintAmount = req.body.mainBlueprintAmount
        let blueprintNote = req.body.mainBlueprintNote

        let reqbody = req.body

        let blueprint = await blueprintController.createBlueprint(blueprintName, blueprintAmount, blueprintNote)

        let tempComponent = null

        for (const key of Object.keys(reqbody)) {
            if (key.includes('hiddenComponent')) {
                tempComponent = await componentController.getComponent(reqbody[key])
            } else if (tempComponent != null && key == tempComponent._id) {
                let amountComponent = await componentAmountController.createComponentAmount(tempComponent, reqbody[key])
                tempComponent = null
                blueprint.components.push(amountComponent)
            }
        }

        await blueprint.save()
        res.redirect('/')

    } else {
        res.redirect('/login')
    }
})



router.post("/updateBlueprint", async (req, res) => {
    if (req.session.isLoggedIn) {

        const blueprintID = req.body.dropdownBlueprints;
        const blueprint = await blueprintController.getBlueprintById(blueprintID);
        const amount = req.body.updateamount;
        const name = req.body.updatename;
        const note = req.body.updateNote;

        if (valider.test(amount)) {
            await blueprintController.updateAmount(blueprint._id, amount);
        }

        if (valider.test(name)) {
            await blueprintController.updateName(blueprint._id, name);
        }

        if (valider.test(note)) {
            await blueprintController.updateNote(blueprint._id, note);
        }

        if (!valider.test(amount) && !valider.test(name) && !valider.test(note)) {
            alert("Du har ikke indtastet noget data")
        }


        res.redirect("/");

    } else {
        res.redirect('/login')
    }
});



//Adds a component to a blueprint
router.post('/addComponent', (req, res) => {
    if (req.session.isLoggedIn) {

        blueprintController.addComponentAmountToBluePrint(req.body.blueprint, req.body.components)

    } else {
        res.redirect('/login')
    }
})

//Adds a blueprint to a blueprint
router.post('/addBlueprint', (req, res) => {
    if (req.session.isLoggedIn) {
        blueprintController.addBlueprintAmountToBlueprint(req.body.firstBlueprint, req.body.secondBlueprint)

    } else {
        res.redirect('/login')
    }

})

router.put('/update', (req, res) => {
    if (req.session.isLoggedIn) {

    } else {
        res.redirect('/login')
    }
    let blueprint
})

module.exports = router