const BlueprintAmount = require('../models/blueprintAmount')
const Product = require('../models/product')


// Create blueprint amount
exports.createBlueprintAmount = async function (blueprint, amount) {
    const blueprintAmount = BlueprintAmount({
        blueprint: blueprint,
        amount: amount
    });
    await blueprintAmount.save();
    return blueprintAmount
}

//Get a blueprintAmount by Id
exports.getBlueprintAmountById = async function (blueprintAmountId) {
    let blueprintAmount = await BlueprintAmount.findById(blueprintAmountId).populate('blueprint').exec()
    return blueprintAmount
}

//Update a blueprint
exports.updateBlueprintAmount = async function () {
    // Denne tror jeg ikke vi skal bruge... slet og lav en ny i stedet
}

//Update a blueprintAmount
exports.updateBlueprintAmountAmount = async function (blueprintAmountId, nAmount) {
    let blueprintAmount = await BlueprintAmount.findById(blueprintAmountId).populate("blueprint").exec()

    blueprintAmount.amount = nAmount
    return await blueprintAmount.save()
}
// detele a blueprintAmount object
exports.deleteBlueprintAmount = async function (blueprintAmountId) {
    return await BlueprintAmount.deleteOne().where("_id").equals(blueprintAmountId).exec()
}

// detele a blueprintAmount object
exports.deleteBlueprintAmount = async function (id) {
    await Product.updateMany(
        { "blueprints": id },
        { "$pull": { "blueprints": id } },
        { "multi": true }
    )
    return await BlueprintAmount.deleteOne().where("_id").equals(id).exec()
}

exports.getBlueprintOfBlueprintAmount = async function (blueprintAmountId) {
    let blueprintAmount = await BlueprintAmount.findById(blueprintAmountId).populate('blueprint').exec()
    return blueprintAmount.blueprint
}

//Gets all blueprintAmounts
exports.getAllBlueprintAmounts = async function () {
    return await BlueprintAmount.find().populate('blueprint').exec()
}

exports.saveBlueprintAmount = async function (jsonComponents, blueprintamounts) {
    for (const component of jsonComponents) {
        for (const blueprint of blueprintamounts) {
            if (component.id == blueprint.id) {
                blueprint.amount = component.value
                await blueprint.save()
            }
        }
    }
}
