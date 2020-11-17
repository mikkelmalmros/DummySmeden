
// Requires
const Blueprint = require('../models/blueprint')

//Creates ablueprint and saves it on MongoDB
exports.createBlueprint = async function (name, amount, components, blueprints) {
    const blueprint = Blueprint({
        name: name,
        amount: amount,
        components: components,
        blueprints: blueprints,
    })
    return await blueprint.save()
}

// Get all blueprints
exports.getBlueprints = async function () {
    return await Blueprint.find().populate('components').populate('blueprints').exec()
}

// Get one blueprint
exports.getBlueprint = async function (blueprint) {
    return await Blueprint.findById(blueprint._id).populate('components').populate('blueprints').exec()
}

//Get one blueprint on the name
exports.getBlueprintByName = async function (name) {
    return await Blueprint.findOne().populate('components').populate('blueprints').where('name').equals(name).exec()
}

//Adds a component to a blueprint
exports.addComponentToBluePrint = async function (blueprint, component) {
    blueprint.components.push(component)
    return await blueprint.save()
}

//Removes a component from a blueprint
exports.removeComponentFromBlueprint = async function (blueprint, component) {
    let components = blueprint.components
    let index = components.indexOf(component._id)
    components.splice(index, 1)
    return await blueprint.save()
}

//Adds a blueprint to a blueprint
//The first blueprint will have the second blueprint added to it
exports.addBlueprintToBlueprint = async function (firstBlueprint, secondBLueprint) {
    firstBlueprint.blueprints.push(secondBLueprint)
    return await firstBlueprint.save()
}

//Removes a blueprint from a blueprint
//The first blueprint will have the second blueprint removed from it
exports.removeBlueprintFromBlueprint = async function (firstBlueprint, secondBLueprint) {
    let blueprints = firstBlueprint.blueprints
    let index = blueprints.indexOf(component._id)
    blueprints.splice(index, 1)
    return await firstBlueprint.save()
}

//Delete a blueprint
exports.deleteBlueprint = async function (blueprint) {
    let id = blueprint._id
    return await Blueprint.deleteOne().where('_id').equals(id).exec()
}

//Update name on a blueprint
exports.updateName = async function(blueprint, name) {
    blueprint.name = name
    return await blueprint.save()
}