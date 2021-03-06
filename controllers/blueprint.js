// Requires
const Blueprint = require("../models/blueprint");
const blueprintAmountController = require('../controllers/blueprintAmount')
const componentAmountController = require('../controllers/componentAmount')

//Creates a blueprint and saves it on MongoDB
exports.createBlueprint = async function (name, amount, note, components, blueprints) {
  const blueprint = Blueprint({
    name: name, amount: amount, note: note, components: components, blueprints: blueprints,
  });
  return await blueprint.save();
};

// Get all blueprints
exports.getBlueprints = async function () {
  return await Blueprint.find()
    .populate("components")
    .populate("blueprints")
    .exec();
};

// Get one blueprint
exports.getBlueprint = async function (blueprintId) {
  return await Blueprint.findById(blueprintId)
    .populate("components")
    .populate("blueprints")
    .exec();
};

// Get one blueprint on id
exports.getBlueprintById = async function (blueprintId) {
  return await Blueprint.findById(blueprintId)
    .populate("components")
    .exec();
};

//Get a list of blueprints by IDs
exports.getBlueprintsById = async function (ids) {
  let list = [];
  if (ids != null || ids != undefined) {
    if (Array.isArray(ids)) {
      for (const id of ids) {
        list.push(
          await Blueprint.findById(id)
            .populate("components")
            .populate("blueprints")
            .exec()
        );
      }
    } else {
      list.push(
        await Blueprint.findById(ids)
          .populate("components")
          .populate("blueprints")
          .exec()
      );
    }
  }
  return list;
};

//Get one blueprint on the name
exports.getBlueprintByName = async function (name) {
  return await Blueprint.findOne()
    .populate("components")
    .populate("blueprints")
    .where("name")
    .equals(name)
    .exec();
};

//Adds a componentAmount to a blueprint
exports.addComponentAmountToBluePrint = async function (blueprintId, componentAmountId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  let componentAmount = await componentAmountController.getComponentAmountById(componentAmountId)
  blueprint.components.push(componentAmount);
  return await tempBp.save();
};

//Removes a componentAmount from a blueprint and deletes the componentAmount
exports.removeComponentAmountFromBlueprint = async function (blueprintId, componentAmountId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  let components = blueprint.components;
  let index = components.indexOf(componentAmountId);

  await componentAmountController.deleteComponentAmount(componentAmountId)
  components.splice(index, 1);

  return await blueprint.save();
};

//Adds a blueprintAmount to a blueprint
exports.addBlueprintAmountToBlueprint = async function (blueprintId, blueprintAmountId) {
  let blueprint = await Blueprint.findById(blueprintId)
    .populate('components')
    .populate('blueprints').exec()

  let blueprintAmount = await blueprintAmountController.findById(blueprintAmountId)

  blueprint.blueprints.push(blueprintAmount);
  return await blueprint.save();
};

//Removes a blueprintAmount from a blueprint and removes the blueprintAmount
exports.removeBlueprintAmountFromBlueprint = async function (blueprintId, blueprintAmountId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()

  let blueprints = blueprint.blueprints;
  let index = blueprints.indexOf(blueprintAmountId);

  await blueprintAmountController.deleteBlueprintAmount(blueprintAmountId)

  blueprints.splice(index, 1);
  return await blueprint.save();
};

//Delete a blueprint and delete all blueprintAmounts and componentAmounts connected to it
exports.deleteBlueprint = async function (blueprintId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').exec()
  let componentAmounts = blueprint.components

  componentAmounts.forEach(async element => {
    await componentAmountController.deleteComponentAmount(element._id)
  });

  //Delete all references
  let blueprintAmounts = await blueprintAmountController.getAllBlueprintAmounts()
  for (const element of blueprintAmounts) {
    if (element.blueprint.id === blueprintId) {
      await blueprintAmountController.deleteBlueprintAmount(element.id)
    }
  }
  return await Blueprint.deleteOne().where("_id").equals(blueprintId).exec()
};

//Update name on a blueprint
exports.updateName = async function (blueprintId, name) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  blueprint.name = name;
  return await blueprint.save();
};

//Update amount on a blueprint
exports.updateAmount = async function (blueprintId, amount) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  blueprint.amount = amount
  return await blueprint.save()
}

//Update note on a blueprint
exports.updateNote = async function (blueprintId, note) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  blueprint.note = note
  return await blueprint.save()
}

//Get all componentAmounts on a blueprint
exports.getAllComponentAmounts = async function (blueprintId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  return blueprint.components
}

//Get all blueprintAmounts on a blueprint
exports.getAllBlueprintAmounts = async function (blueprintId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  return blueprint.blueprints
}

exports.updateBlueprint = async function (id, name, amount, note) {
  let blueprint = await Blueprint.findById(id).exec()

  blueprint.name = name
  blueprint.amount = amount
  blueprint.note = note

  return await blueprint.save()
}