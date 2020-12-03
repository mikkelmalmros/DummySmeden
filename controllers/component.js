const Component = require('../models/component')
const compAmountController = require('./componentAmount')

exports.createComponent = async function (name, amount, note) {
    const component = Component({
        name: name,
        amount: amount,
        note: note
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

exports.updateNote = async function (component, note) {
    component.note = note
    return await component.save()
}

exports.updateComponent = async function (component, name, amount, note) {
    component.name = name
    component.amount = amount
    component.note = note
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
    let allCompAmounts = await compAmountController.getAllCompAmounts()
    for (const element of allCompAmounts) {
        if (element.component.id === id) {
            await compAmountController.deleteComponentAmount(element.id)
        }
    }
    return await Component.deleteOne().where('_id').equals(id).exec()
}