const express = require('express')
const router = express()
const body = require('body-parser')
const componentController = require("../controllers/component");
const blueprintController = require("../controllers/blueprint");
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

module.exports = router