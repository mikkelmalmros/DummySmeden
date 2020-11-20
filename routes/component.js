const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
// component controller
const componentController = require("../controllers/component");

router.use(body.urlencoded({ extended: false }))
router.use(body.json())

const valider = /[a-zA-Z0-9]+/;


//Create a component 
router.post("/createComponent", async (req, res) => {
    const name = req.body.name2;
    const amount = req.body.amount2;
    const storageMin = req.body.storageMin2;

    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        await componentController.createComponent(name, amount, storageMin);
    } else {
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /createComponent");
    }

    res.redirect("/");
});

//update a component using the data in inputfields 

router.post("/updateComponent", async (req, res) => {
    const componentID = req.body.dropdownComponents;
    const component = await componentController.getComponent(componentID);
    const amount = req.body.updateamount;
    const name = req.body.updatename;
    const minimum = req.body.updatemin;

    if (valider.test(amount)) {
        await componentController.updateAmount(component, amount);
    } else {
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /updateComponent (amount)");
    }

    if (valider.test(name)) {
        await componentController.updateName(component, name);
    } else {
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /updateComponent (name)");
    }

    if (valider.test(minimum)) {
        await componentController.updateMininum(component, minimum);
    } else {
        //Vis pæn besked til brugeren
        console.log("Forkerte værdier i /updateComponent (minimum)");
    }

    res.redirect("/");
});

//Delete a component by using the data from dropdownDelete menu
router.post("/deleteComponent", async (req, res) => {
    const componentID = req.body.dropdownDelete;
    await componentController.deleteComponent(componentID);
    res.redirect("/");
});

module.exports = router