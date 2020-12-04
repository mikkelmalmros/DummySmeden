require("should")
const { server } = require("../app.js")


const blueprintController = require("../controllers/blueprint");
const componentController = require("../controllers/component");
describe('Component', () => {
    describe('get component', () => {

        let compTest = {
            "_id": '5fc8cd56c9dd761e42114165',
            "name": 'newName',
            "amount": 12,
            "note": 'newNote'
        }
        it('Enkelt component name', async () => {
            let comp = await componentController.getComponent('5fc8cd56c9dd761e42114165')
            comp.name.should.be.equal(compTest.name)
        })
        it('Enkelt component amount', async () => {
            let comp = await componentController.getComponent('5fc8cd56c9dd761e42114165')
            comp.amount.should.be.equal(compTest.amount)
        })
        it('Enkelt component note', async () => {
            let comp = await componentController.getComponent('5fc8cd56c9dd761e42114165')
            comp.note.should.be.equal(compTest.note)
        })
    })
    describe('create component', () => {
        let name = 'søm'
        let amount = 12
        let note = 'syv tommer'
        it('create comp', async () => {
            let comp = await componentController.createComponent(name, amount, note)
            comp.name.should.be.equal(name)
            comp.amount.should.be.equal(amount)
            comp.note.should.be.equal(note)
        })
    })

    describe('Update component', () => {
        it('update name', async () => {
            let component = await componentController.getComponent('5fc8cd56c9dd761e42114165')
            let name = 'newName'
            let updateComp = await componentController.updateName(component, name)
            updateComp.name.should.be.equal(name)
        })

        it('update amount', async () => {
            let component = await componentController.getComponent('5fc8cd56c9dd761e42114165')
            let amount = 12
            let updateComp = await componentController.updateAmount(component, amount)
            updateComp.amount.should.be.equal(amount)
        })
        it('update note', async () => {
            let component = await componentController.getComponent('5fc8cd56c9dd761e42114165')
            let note = 'newNote'
            let updateComp = await componentController.updateNote(component, note)
            updateComp.note.should.be.equal(note)
        })
    })

    describe("delete component", () => {
        let name = 'søm'
        let amount = 12
        let note = 'syv tommer'
        it("Delete component", async () => {
            let comp = await componentController.createComponent(name, amount, note)
            let compdelete = await componentController.deleteComponent(comp._id)

            compdelete.deletedCount.should.be.equal(1)

        })
    })
})

describe("Api Test", () => {






})
