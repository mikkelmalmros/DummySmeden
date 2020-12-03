const express = require('express')
//Ændret fra const router = express.Router(), locals virker ikke ellers
const router = express()
const body = require('body-parser')
// component controller
const productController = require("../controllers/product")
const blueprintController = require('../controllers/blueprint')
const blueprintAmountController = require('../controllers/blueprintAmount')

router.use(body.urlencoded({ extended: false }))
router.use(body.json())

const valider = /[a-zA-Z0-9]+/;

//Create a product
router.post("/createProduct", async (req, res) => {
    if (req.session.isLoggedIn) {
        const name = req.body.inputProdName;
        const amount = req.body.inputProdAmount;
        const note = req.body.inputProdNote;
        const blueprints = await blueprintController.getBlueprintsById(
            req.body.dropdownBlueprint
        );
        res.render("productAmount", { mainProductName: name, amount: amount, note: note, blueprints: blueprints });
    } else {
        res.redirect('/login')
    }
});

router.post('/amount', async (req, res) => {
    if (req.session.isLoggedIn) {
        let productName = req.body.mainProductName
        let productAmount = req.body.mainProductAmount
        let productNote = req.body.mainProductNote

        let reqbody = req.body

        let product = await productController.createProduct(productName, productAmount, productNote)

        let tempBlueprint = null

        for (const key of Object.keys(reqbody)) {
            if (key.includes('hiddenBlueprint')) {
                tempBlueprint = await blueprintController.getBlueprint(reqbody[key])
            } else if (tempBlueprint != null && key == tempBlueprint._id) {
                let amountBlueprint = await blueprintAmountController.createBlueprintAmount(tempBlueprint, reqbody[key])
                tempBlueprint = null
                product.blueprints.push(amountBlueprint)
            }
        }
        await product.save()
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})

module.exports = router