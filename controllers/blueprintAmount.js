const blueprintAmount = require('../models/blueprintAmount');
const BlueprintAmount = require('../models/blueprintAmount')


// Create blueprint amount
exports.createBlueprintAmount = async function (blueprint, amount) {
    const blueprintAmount = BlueprintAmount({
        blueprint: blueprint,
        amount: amount
    });
    await blueprintAmount.save();
    return blueprintAmount
}

//Update a blueprint
exports.updateBlueprintAmount = async function () {
    // Denne tror jeg ikke vi skal bruge... slet og lav en ny i stedet
}

//Update a blueprintAmount
exports.updateBlueprintAmountAmount = async function (blueprintAmountId, nAmount) {
    let blueprintAmount = BlueprintAmount.findById(blueprintAmountId).populate("blueprint").exec()

    blueprintAmount.amount = nAmount
    return await blueprintAmount.save()
}
// detele a blueprintAmount object
exports.deleteBlueprintAmount = async function (blueprintAmountId) {
    return await BlueprintAmount.deleteOne().where("_id").equals(blueprintAmountId).exec()
}