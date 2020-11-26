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
    const name = req.body.inputProdName;
    const amount = req.body.inputProdAmount;
    const storageMin = req.body.InputProdMin;

    const blueprints = await blueprintController.getBlueprintsById(
        req.body.dropdownBlueprint
    );

    // if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
    //     await productController.createProduct(name, amount, storageMin, blueprints);
    // } else {

    // }
    res.render("productAmount", { mainProductName: name, amount: amount, storageMin: storageMin, blueprints: blueprints });
});

router.post('/amount', async (req, res) => {
    let productName = req.body.mainProductName
    let productAmount = req.body.mainProductAmount
    let productStorageMin = req.body.mainProductStorageMin

    let reqbody = req.body

    let product = await productController.createProduct(productName, productAmount, productStorageMin)

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
})

//update a product using the data in inputfields
router.post("/updateProduct", async (req, res) => {
    const productID = req.body.dropdownProducts;
    const product = await productController.getProductById(productID);
    const amount = req.body.updateamount;
    const name = req.body.updatename;
    const minimum = req.body.updatemin;

    if (valider.test(amount)) {
        await productController.updateProductAmountById(product._id, amount)
    }

    if (valider.test(name)) {
        await productController.updateProductNameById(product._id, name)
    }

    if (valider.test(minimum)) {
        await productController.updateProductStorageMinById(product._id, minimum)
    }

    // if (!valider.test(amount) && !valider.test(name) && !valider.test(minimum)) {
    //     // alert("Du har ikke indtastet noget data")
    // }
    res.redirect("/");
});

//Delete a component by using the data from dropdownDelete menu
router.post("/deleteProduct", async (req, res) => {
    console.log('ikke lavet endnu');
    res.redirect("/");
});


module.exports = router