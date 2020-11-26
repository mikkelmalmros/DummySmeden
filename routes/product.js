const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
// component controller
const productController = require("../controllers/component");


router.use(body.urlencoded({ extended: false }))
router.use(body.json())

const valider = /[a-zA-Z0-9]+/;

//Create a product
router.post("/createProduct", async (req, res) => {
    const name = req.body.inputProdName;
    const amount = req.body.inputProdAmount;
    const storageMin = req.body.InputProdMin;

    if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
        await productController.createComponent(name, amount, storageMin);
    } else {

    }
    res.redirect("/");
});

//update a component using the data in inputfields
router.post("/updateProduct", async (req, res) => {
    console.log('ikke lavet endnu');

    const blueprintID = req.body.dropdownBlueprints;
    const blueprint = await blueprintController.getBlueprintById(blueprintID);
    const amount = req.body.updateamount;
    const name = req.body.updatename;
    const minimum = req.body.updatemin;

    if (valider.test(amount)) {
    }

    if (valider.test(name)) {
    }

    if (valider.test(minimum)) {
    }

    if (!valider.test(amount) && !valider.test(name) && !valider.test(minimum)) {
        alert("Du har ikke indtastet noget data")
    }
    res.redirect("/");
});

//Delete a component by using the data from dropdownDelete menu
router.post("/deleteProduct", async (req, res) => {
    console.log('ikke lavet endnu');
    res.redirect("/");
});


module.exports = router