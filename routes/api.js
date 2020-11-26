const express = require('express')
const router = express()
const body = require('body-parser')

const componentController = require("../controllers/component")
const blueprintController = require("../controllers/blueprint")
const componentAmountController = require('../controllers/componentAmount')
const productController = require('../controllers/product')
const blueprintAmountController = require('../controllers/blueprintAmount')
const blueprintAmount = require('../models/blueprintAmount')

router.use(body.urlencoded({ extended: false }))
router.use(body.json())

//PRODUCTS
//--------------------------------------------------------------------------------------------------------

//COMPONENTS
//--------------------------------------------------------------------------------------------------------

//Gets all componentAmounts of a given blueprint found by id in the param
router.get('/getComponentAmounts/:id', async (req, res) => {
    console.log(req.params.id);
    let componentAmounts = await blueprintController.getAllComponentAmounts(req.params.id)
    res.json(componentAmounts)
})

router.get('/getComponent/:id', async (req, res) => {
    console.log("Spurgt ID : " + req.params.id);
    let component = await componentController.getComponent(req.params.id)
    console.log("Returneret component: " + component);
    res.json(component)
})
//BLUEPRINTS
//---------------------------------------------------------------------------------------------------------
router.delete('/deleteBlueprint/:id', async (req, res) => {
    console.log("slettet ID : " + req.params.id);
    await blueprintController.deleteBlueprint(req.params.id)
    // res.redirect('/')
})
router.put('/updateBlueprint/:id', async (req, res) => {
    console.log("updateret ID: " + req.params.id)





    await blueprintController.update
}
)
//Gets all blueprintAmounts of a given product found by id in the param
router.get('/getBlueprintAmounts/:id', async (req, res) => {
    let blueprintAmounts = await productController.getAllBlueprintAmounts(req.params.id)
    res.json(blueprintAmounts)
})

//COMPONENTAMOUNTS
//---------------------------------------------------------------------------------------------------------
router.get('/getComponentOnComponentAmount/:id', async (req, res) => {
    console.log("Spurgt ID : " + req.params.id);
    let component = await componentAmountController.getComponentOfComponentAmount(req.params.id)
    console.log("Returneret component: " + component);
    res.json(component)
})

//BlUEPRINTAMOUNTS
//---------------------------------------------------------------------------------------------------------
router.get('/getBlueprintOnBlueprintAmount/:id', async (req, res) => {
    let blueprint = await blueprintAmountController.getBlueprintOfBlueprintAmount(req.params.id)
    res.json(blueprint)
})

module.exports = router