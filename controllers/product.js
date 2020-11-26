const Product = require('../models/product')
const BlueprintAmount = require('../models/blueprintAmount')

//create
exports.createProduct = async function (name, amount, storageMin) {
    const product = Product({
        name: name,
        amount: amount,
        storageMin: storageMin,
    })
    return await product.save();
}

//update Name
exports.updateProductNameById = async function (productId, name) {
    let product = await Product.findById(productId).populate("blueprints").exec()
    product.name = name
    return await product.save()
}
//update amount
exports.updateProductAmountById = async function (productId, amount) {
    let product = await Product.findById(productId).populate("blueprints").exec()
    product.amount = amount
    return await product.save()
}
//update storageMin
exports.updateProductStorageMinById = async function (productId, storageMin) {
    let product = await Product.findById(productId).populate("blueprints").exec()
    product.storageMin = storageMin
    return await product.save()
}

//Update blueprint
exports.updateBlueprintAmount

//delete
exports.deleteProductById = async function (productId) {

}

//get all
exports.getAllProducts = async function () {
    return await Product.find().populate("blueprints").exec()
}
//get by id
exports.getProductById = async function (productId) {
    return await Product.findById(productId).populate("blueprints").exec()
}

//Add a blueprint to a product
exports.addBlueprintToProduct = async function (blueprintId, productId) {
    let product = await Product.findById(productId).populate("blueprints").exec()

    let blueprint = await BlueprintAmount.findById(blueprintId).populate("blueprint").exec()

    product.blueprints.push(blueprint)
    return await product.save()

}
// remove blueprint from product
exports.removeBlueprintFromProduct = async function (blueprintId, productId) {
    let product = await Product.findById(productId).populate("blueprints").exec()
    let blueprint = await BlueprintAmount.findById(blueprintId).populate("blueprint").exec()
    product.blueprints.splice(product.blueprint.indexOf(blueprint), 1)

    return await product.save()
}

//Get all componentBlueprints on a product
exports.getAllBlueprintAmounts = async function (productid) {
    let product = await Product.findById(productid).populate('blueprints').exec()
    return product.blueprints
}