const Component = require('../models/component')
const Blueprint = require('../models/blueprint')

exports.createComponent = async function (name, amount, storageMin) {
    const component = Component({
        name: name,
        amount: amount,
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

exports.updateName = async function (component, name) {
    component.name = name
    return await component.save()
}

exports.updateMininum = async function (component, minimum) {
    component.storageMin = minimum
    return await component.save()
}

exports.getComponent = async function (id) {
    return await Component.findById(id).exec()
}

exports.getComponentsById = async function (ids) {
    let list = []
    if (ids != null || ids != undefined)
        if (Array.isArray(ids)) {
            for (const id of ids) {
                list.push(await Component.findById(id).exec())
            }
        } else {
            list.push(await Component.findById(ids).exec())
        }
    return list;
}

exports.deleteComponent = async function (id) {
    await Blueprint.updateMany(
        { "components": id },
        { "$pull": { "components": id } },
        { "multi": true }
    )
    return await Component.deleteOne().where('_id').equals(id).exec()
}