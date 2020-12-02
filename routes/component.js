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


//Create a component
router.post("/createComponent", async (req, res) => {
    if (req.session.isLoggedIn) {
        const name = req.body.inputCompName;
        const amount = req.body.inputCompAmount;
        const note = req.body.inputCompNote;

        if (valider.test(name) && valider.test(amount) && valider.test(note)) {
            await componentController.createComponent(name, amount, note);
        } else {
            alert("Intet blev oprettet, du manglede noget data")
        }
        res.redirect("/");
    } else {
        res.redirect('/login')
    }

});

//update a component using the data in inputfields
router.post("/updateComponent", async (req, res) => {
    if (req.session.isLoggedIn) {
        const componentID = req.body.dropdownComponents;
        const component = await componentController.getComponent(componentID);
        const amount = req.body.updateamount;
        const name = req.body.updatename;
        const note = req.body.updateNote;

        if (valider.test(amount)) {
            await componentController.updateAmount(component, amount);
        }

        if (valider.test(name)) {
            await componentController.updateName(component, name);
        }

        if (valider.test(note)) {
            await componentController.updateNote(component, note);
        }

        if (!valider.test(amount) && !valider.test(name) && !valider.test(note)) {
            alert("Du har ikke indtastet noget data")
        }
        res.redirect("/");
    } else {
        res.redirect('/login')
    }


});

//Delete a component by using the data from dropdownDelete menu
// router.post("/deleteComponent", async (req, res) => {
//     const componentID = req.body.dropdownDelete;
//     await componentController.deleteComponent(componentID);
//     res.redirect("/");
// });

module.exports = router