// Requires
const { json } = require("body-parser");
const Blueprint = require("../models/blueprint");
const Component = require("../models/component");
const BlueprintAmount = require('../models/blueprintAmount')
const ComponentAmount = require('../models/componentAmount')

//Creates ablueprint and saves it on MongoDB
exports.createBlueprint = async function (name, amount, storageMin, components, blueprints) {
  const blueprint = Blueprint({
    name: name, amount: amount, storageMin: storageMin, components: components, blueprints: blueprints,
  });
  await blueprint.save();
  return blueprint
};

// Get all blueprints
exports.getBlueprints = async function () {
  return await Blueprint.find()
    .populate("components")
    .populate("blueprints")
    .exec();
};

// Get one blueprint
exports.getBlueprint = async function (blueprint) {
  return await Blueprint.findById(blueprint._id)
    .populate("components")
    .populate("blueprints")
    .exec();
};

// Get one blueprint on id
exports.getBlueprintById = async function (blueprintId) {
  return await Blueprint.findById(blueprintId)
    .populate("components")
    .populate("blueprints")
    .exec();
};

//Get a list of blueprints by IDs
exports.getBlueprintssById = async function (ids) {
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

//Adds a component to a blueprint
exports.addComponentToBluePrint = async function (blueprintId, componentAmountId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  let componentAmount = await ComponentAmount.findById(componentAmountId).exec()
  blueprint.components.push(componentAmount);
  return await tempBp.save();
};

//Removes a component from a blueprint
exports.removeComponentFromBlueprint = async function (blueprintId, componentAmountId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  let components = blueprint.components;
  let index = components.indexOf(componentAmountId);
  components.splice(index, 1);
  return await blueprint.save();
};

//Adds a blueprint to a blueprint
//The first blueprint will have the second blueprint added to it
exports.addBlueprintToBlueprint = async function (blueprintId, blueprintAmountId) {
  let blueprint = await Blueprint.findById(blueprintId)
    .populate('components')
    .populate('blueprints').exec()

  let blueprintAmount = await BlueprintAmount.findById(blueprintAmountId).exec()
  blueprint.blueprints.push(blueprintAmount);
  return await blueprint.save();
};

//Removes a blueprint from a blueprint
//The first blueprint will have the second blueprint removed from it
exports.removeBlueprintFromBlueprint = async function (blueprintId, blueprintAmountId) {
  let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()

  let blueprints = blueprint.blueprints;
  let index = blueprints.indexOf(blueprintAmountId);

  blueprints.splice(index, 1);
  return await firstBlueprint.save();
};

//Delete a blueprint
exports.deleteBlueprint = async function (blueprint) {
  let id = blueprint;
  return await Blueprint.deleteOne().where("_id").equals(id).exec();
};

//Update name on a blueprint
exports.updateName = async function (blueprint, name) {
  blueprint.name = name;
  return await blueprint.save();
};

//Update amount on a blueprint
exports.updateAmount = async function (blueprint, amount) {
  blueprint.amount = amount
  return await blueprint.save()
}

//Update storageMin on a blueprint
exports.updatestorageMin = async function (blueprint, storageMin) {
  blueprint.storageMin = storageMin
  return await blueprint.save()
}

// check if id og a blueprint is contained in another blueprint
exports.findBlueprintInBlueprint = async function (blueprintId) {
  let allBlueprints = await this.getBlueprints();


  for (let i = 0; i < allBlueprints.length; i++) {
    for (let j = 0; j < allBlueprints[i].blueprints.length; j++) {

      const element = allBlueprints[i].blueprints[j].blueprint._id;

      //console.log("El: " + element);
      //console.log("bp: " + blueprintId._id);

      if ((element + "") == (blueprintId._id + "")) {
        return blueprintId
      }

    }
  }
  return "intet"
}