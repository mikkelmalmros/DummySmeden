const Component = require('../models/component')
const Blueprint = require('../models/blueprint')

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
    const doc = Blueprint.blueprint;

    await Component.deleteOne().where('_id').equals(id).exec()
    await doc.pull().where('_id').equals(id).exec()
    return 'yeet'
}

exports.deleteComponent2 = async function (id) {
    await Blueprint.update(
        { "blueprints": id },
        { "$pull": { "components": id } },
        { "multi": true }
    )
    return await Component.deleteOne().where('_id').equals(id).exec()
}