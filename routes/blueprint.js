const express = require('express')
const router = express.Router()
const controller = require('../controllers/blueprint')
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended : false}))
router.use(bodyParser.json())


//Creates blueprint
router.post('/create', (req, res) => {
    
    controller.createBlueprint(req.body.name, req.body.amount, req.body.components, req.body.blueprints)
})

//Adds a component to a blueprint
router.post('/addComponent', (req, res) => {
    controller.addComponentToBluePrint(req.body.blueprint, req.body.components)
})

//Adds a blueprint to a blueprint
router.post('/addBlueprint', (req, res) => {
    controller.addBlueprintToBlueprint(req.body.firstBlueprint, req.body.secondBlueprint)
})

//Delete blueprint
router.delete('/delete', (req, res) => {

    let blueprint = req.body.blueprint

    if(!blueprint) {
        return res
                    .status(404)
                    .json({error: 'Blueprint not found'})
    }
    controller.deleteBlueprint(req.body.blueprint)
})

router.put('/update', (req,res) => {

    let blueprint
})

module.exports = router