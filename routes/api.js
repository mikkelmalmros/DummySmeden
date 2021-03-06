const express = require('express')
const router = express()
const body = require('body-parser')

const componentController = require("../controllers/component")
const blueprintController = require("../controllers/blueprint")
const componentAmountController = require('../controllers/componentAmount')
const productController = require('../controllers/product')
const blueprintAmountController = require('../controllers/blueprintAmount')

router.use(body.urlencoded({ extended: false }))
router.use(body.json())

//PRODUCTS
//--------------------------------------------------------------------------------------------------------
router.delete('/deleteProduct/:id', async (req, res) => {
    await productController.deleteProduct(req.params.id)
})

router.put('/updateProduct/:id', async (req, res) => {
    // Find data
    let product = await productController.getProductById(req.params.id)
    let jsonComponents = req.body.blueprintAmounts
    //Updates and saves product
    await productController.updateProduct(req.params.id, req.body.name, req.body.amount, req.body.note)
    await blueprintAmountController.saveBlueprintAmount(jsonComponents, product.blueprints)
})

router.get('/getProduct/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let product = await productController.getProductById(req.params.id)
        res.json(product)
    } else {
        res.redirect('/login')
    }
})

//COMPONENTS
//--------------------------------------------------------------------------------------------------------

//Gets all componentAmounts of a given blueprint found by id in the param
router.get('/getComponentAmounts/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let componentAmounts = await blueprintController.getAllComponentAmounts(req.params.id)
        res.json(componentAmounts)
    } else {
        res.redirect('/login')
    }
})

router.get('/getComponent/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let component = await componentController.getComponent(req.params.id)
        res.json(component)
    } else {
        res.redirect('/login')
    }
})

router.delete('/deleteComponent/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        await componentController.deleteComponent(req.params.id)
    } else {
        res.redirect('/login')
    }
})

router.put('/updateComponent/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let component = await componentController.getComponent(req.params.id)
        await componentController.updateComponent(component, req.body.name, req.body.amount, req.body.note)
    } else {
        res.redirect('/login')
    }
})

router.post('/createComponent', async (req, res) => {
    if (req.session.isLoggedIn) {
        await componentController.createComponent(req.body.name, req.body.amount, req.body.note)
    } else {
        res.redirect('/login')
    }
})
//BLUEPRINTS
//---------------------------------------------------------------------------------------------------------
router.delete('/deleteBlueprint/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        await blueprintController.deleteBlueprint(req.params.id)
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
        await blueprintController.updateBlueprint(req.params.id, req.body.name, req.body.amount, req.body.note)
        //Updates and saves components in blueprint, ud fra referance
        await componentAmountController.saveComponentAmount(jsonComponents, blueprint.components)
    } else {
        res.redirect('/login')
    }
})

//Gets all blueprintAmounts of a given product found by id in the param
router.get('/getBlueprintAmounts/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let blueprintAmounts = await productController.getAllBlueprintAmounts(req.params.id)
        res.json(blueprintAmounts)
    } else {
        res.redirect('/login')
    }
})

router.get('/getBlueprint/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
        let blueprint = await blueprintController.getBlueprintById(req.params.id)
        res.json(blueprint)
    } else {
        res.redirect('/login')
    }

})

//COMPONENTAMOUNTS
//---------------------------------------------------------------------------------------------------------
router.get('/getComponentOnComponentAmount/:id', async (req, res) => {
    if (req.session.isLoggedIn) {
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