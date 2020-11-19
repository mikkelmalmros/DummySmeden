// Requires
const { json } = require("body-parser");
const Blueprint = require("../models/blueprint");
const Component = require("../models/component");

//Creates ablueprint and saves it on MongoDB
exports.createBlueprint = async function (
  name,
  amount,
  storageMin,
  components,
  blueprints
) {
  const blueprint = Blueprint({
    name: name,
    amount: amount,
    storageMin: storageMin,
    components: components,
    blueprints: blueprints,
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
exports.addComponentToBluePrint = async function (blueprint, component) {
  let tempBp = JSON.parse(blueprint);
  let tempC = JSON.parse(component);
  //let blueprint = await Blueprint.findById(blueprint).populate('components').populate('blueprints').exec()
  //let component = await Component.findById(componentId).exec()
  tempBp.components.push(tempC);
  return await tempBp.save();
};

//Removes a component from a blueprint
exports.removeComponentFromBlueprint = async function (blueprint, component) {
  //let blueprint = await Blueprint.findById(blueprintId).populate('components').populate('blueprints').exec()
  let components = blueprint.components;
  let index = components.indexOf(component._id);
  components.splice(index, 1);
  return await blueprint.save();
};

//Adds a blueprint to a blueprint
//The first blueprint will have the second blueprint added to it
exports.addBlueprintToBlueprint = async function (
  firstBlueprint,
  secondBLueprint
) {
  // let firstBlueprint = await Blueprint.findById(firstBlueprintId).populate('components').populate('blueprints').exec()
  // let secondBLueprint = await Blueprint.findById(secondBLueprintId).populate('components').populate('blueprints').exec()
  firstBlueprint.blueprints.push(secondBLueprint);
  return await firstBlueprint.save();
};

//Removes a blueprint from a blueprint
//The first blueprint will have the second blueprint removed from it
exports.removeBlueprintFromBlueprint = async function (
  firstBlueprint,
  secondBLueprint
) {
  // let firstBlueprint = await Blueprint.findById(firstBlueprintId).populate('components').populate('blueprints').exec()
  // let secondBLueprint = await Blueprint.findById(secondBLueprintId).populate('components').populate('blueprints').exec()

  let firstBlueprints = firstBlueprint.blueprints;
  let index = blueprints.indexOf(secondBLueprint._id);

  blueprints.splice(index, 1);
  return await firstBlueprint.save();
};

//Delete a blueprint
exports.deleteBlueprint = async function (blueprint) {
  let id = blueprint._id;
  return await Blueprint.deleteOne().where("_id").equals(id).exec();
};

//Update name on a blueprint
exports.updateName = async function (blueprint, name) {
  blueprint.name = name;
  return await blueprint.save();
};
