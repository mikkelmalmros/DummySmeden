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