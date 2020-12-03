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

module.exports = router