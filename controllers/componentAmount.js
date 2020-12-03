const ComponentAmount = require('../models/componentAmount')
const Blueprint = require('../models/blueprint')

// Create componentAmount
exports.createComponentAmount = async function (component, amount) {
  const componentAmount = ComponentAmount({
    component: component,
    amount: amount
  });
  return await componentAmount.save();
}

//Get a componentAmount by Id
exports.getComponentAmountById = async function (componentAmountId) {
  return await ComponentAmount.findById(componentAmountId).populate('component').exec()
}

exports.getComponentOfComponentAmount = async function (componentAmountId) {
  let componentAmount = ComponentAmount.findById(componentAmountId).populate('component').exec()
  return componentAmount.component
}

//Update a componentAmount
exports.updateComponentAmountAmountById = async function (componentAmountId, nAmount) {
  let componentAmount = await ComponentAmount.findById(blueprintAmountId).populate("component").exec()
  componentAmount.amount = nAmount
  return await componentAmount.save()
}

//Update a componentAmount
exports.updateComponentAmountAmount = async function (componentAmount, nAmount) {
  componentAmount.amount = nAmount
  return await componentAmount.save()
}

// detele a componentAmount object
exports.deleteComponentAmount = async function (id) {
  await Blueprint.updateMany(
    { "components": id },
    { "$pull": { "components": id } },
    { "multi": true }
  )
  return await ComponentAmount.deleteOne().where("_id").equals(id).exec()
}

exports.getAllCompAmounts = async function () {
  return await ComponentAmount.find().populate('component').exec()
}

exports.saveComponentAmount = async function (jsonComponents, blueprintComponents) {
  for (const component of jsonComponents) {
    for (const componentAmount of blueprintComponents) {
      if (component.id == componentAmount.id) {
        componentAmount.amount = component.value
        await componentAmount.save()
      }
    }
  }
}