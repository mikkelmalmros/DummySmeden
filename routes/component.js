const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
// component controller
const componentController = require("../controllers/component");
const alert = require('alert')


router.use(body.urlencoded({ extended: false }))
router.use(body.json())

const valider = /[a-zA-Z0-9]+/;
const validerString = /[a-zA-Z0-9]+/;
const validerTal = /[0-9]+/;


//Create a component
router.post("/createComponent", async (req, res) => {
    if (req.session.isLoggedIn) {
        const name = req.body.inputCompName;
        const amount = req.body.inputCompAmount;
        const note = req.body.inputCompNote;

        if (valider.test(name) && valider.test(amount) && valider.test(note)) {
            await componentController.createComponent(name, amount, note);
        }
        res.redirect("/");
    } else {
        res.redirect('/login')
    }
});

//update a component using the data in inputfields
router.post("/updateComponent", async (req, res) => {
    console.log("hej");
    if (req.session.isLoggedIn) {
        const componentID = req.body.dropdownComponents;
        const component = await componentController.getComponent(componentID);
        const amount = req.body.updateamount;
        const name = req.body.updatename;
        const note = req.body.updateNote;
        console.log("så fuck nu af!!!!!");

        if (valider.test(amount)) {
            console.log("så fuck dog af");
            await componentController.updateAmount(component, amount);
        }

        if (valider.test(name)) {
            console.log("så fuck dog af")
            await componentController.updateName(component, name);
        }

        if (valider.test(note)) {
            console.log("så fuck dog af");
            await componentController.updateNote(component, note);
        }
        res.redirect("/");
    } else {
        res.redirect('/login')
    }
});

module.exports = router