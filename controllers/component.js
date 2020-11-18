const Component = require('../models/component')

exports.createComponent = async function (name, amount, description, storageMin) {
    const component = Component({
        name: name,
        amount: amount,
        description: description,
        storageMin: storageMin
    })
    return await component.save()
}

exports.getComponents = async function () {
    return await Component.find().exec()
}

exports.updateAmount = async function (component, amount) {
    component.amount = amount
    return await component.save()
}

exports.getComponent = async function (id) {
    return await Component.findById(id).exec()
}

exports.getComponentsById = async function (ids) {
    array.forEach(id => {

    });
    return await Component.findById(id).exec()
}