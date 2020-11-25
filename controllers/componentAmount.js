const ComponentAmount = require('../models/componentAmount')

// Create componentAmount
exports.createComponentAmount = async function(component, amount) {
    const componentAmount = ComponentAmount({
        component:component,
        amount:amount
      });
      await componentAmount.save();
      return componentAmount
}

//Get a componentAmount by Id
exports.getComponentAmountById = async function(componentAmountId) {
  let componentAmount = await ComponentAmount.findById().populate('component').exec()
  return componentAmount
}

//Update a componentAmount
exports.updateComponentAmount = async function () {
  // Denne tror jeg ikke vi skal bruge... slet og lav en ny i stedet
}

//Update a componentAmount
exports.updateComponentAmountAmount = async function (componentAmountId, nAmount) {
  let componentAmount = await ComponentAmount.findById(blueprintAmountId).populate("component").exec()

  componentAmount.amount = nAmount
  return await componentAmount.save()
}
// detele a componentAmount object
exports.deleteComponentAmount = async function (componentAmountId) {
  return await ComponentAmount.deleteOne().where("_id").equals(componentAmountId).exec()
}