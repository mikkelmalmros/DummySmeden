const BlueprintAmount = require('../models/blueprintAmount')

exports.saveBlueprintAmount = async function(blueprintAmount) {
    return await blueprintAmount.save()
}

exports.createBlueprintAmount = async function(blueprint, amount) {
    const blueprintAmount = BlueprintAmount({
        blueprint:blueprint,
        amount:amount
      });
      await blueprintAmount.save();
      return blueprintAmount
}