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
    if (req.session.isLoggedIn) {
        console.log(req.params.id);
        let componentAmounts = await blueprintController.getAllComponentAmounts(req.params.id)
        res.json(componentAmounts)
      } else {
        res.redirect('/login')
      }
})

router.get('/getComponent/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        console.log("Spurgt ID : " + req.params.id);
        let component = await componentController.getComponent(req.params.id)
        console.log("Returneret component: " + component);
        res.json(component)
      } else {
        res.redirect('/login')
      }
})

router.delete('/deleteComponent/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        console.log("slettet ID : " + req.params.id);
        await componentController.deleteComponent(req.params.id)
    res.redirect('/')
      } else {
        res.redirect('/login')
      }
})
//BLUEPRINTS
//---------------------------------------------------------------------------------------------------------
router.delete('/deleteBlueprint/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        console.log("slettet ID : " + req.params.id);
        await blueprintController.deleteBlueprint(req.params.id)
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})

router.put('/updateBlueprint/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        // Find data
        let blueprint = await blueprintController.getBlueprint(req.params.id)
        let jsonComponents = req.body.componentAmounts
        //Updates and saves blueprint
        blueprintController.updateBlueprint(req.params.id, req.body.name, req.body.amount, req.body.storrageMin)
        //Updates and saves components in blueprint, ud fra referance
        blueprintAmountController.saveBlueprintAmount(jsonComponents, blueprint.components)
    } else {
        res.redirect('/login')
    } 
})

//Fisk
//Gets all blueprintAmounts of a given product found by id in the param
router.get('/getBlueprintAmounts/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let blueprintAmounts = await productController.getAllBlueprintAmounts(req.params.id)
        res.json(blueprintAmounts)
    } else {
        res.redirect('/login')
    }
})

//COMPONENTAMOUNTS
//---------------------------------------------------------------------------------------------------------
router.get('/getComponentOnComponentAmount/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        console.log("Spurgt ID : " + req.params.id);
        let component = await componentAmountController.getComponentOfComponentAmount(req.params.id)
        res.json(component)
    } else {
        res.redirect('/login')
    }
})

//BlUEPRINTAMOUNTS
//---------------------------------------------------------------------------------------------------------
router.get('/getBlueprintOnBlueprintAmount/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let blueprint = await blueprintAmountController.getBlueprintOfBlueprintAmount(req.params.id)
        res.json(blueprint)
    } else {
        res.redirect('/login')
    }  
})

module.exports = router