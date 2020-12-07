const validerString = /[a-zA-Z0-9]+/;
const validerTal = /[0-9]+/;
document.querySelectorAll('.collapsibleButton').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling
        button.classList.toggle('collapsibleButton--active')

        if (button.classList.contains('collapsibleButton--active')) {
            content.style.maxHeight = content.scrollHeight + 'px'
        } else {
            content.style.maxHeight = 0
        }
    })
})

document.querySelectorAll('.name').forEach(clickable => {
    clickable.addEventListener('click', () => {
        let firstChild = clickable.parentElement.nextElementSibling.children[0]
        clickable.classList.toggle('name--active')

        if (clickable.classList.contains('name--active')) {
            firstChild.style.display = 'block'
            clickable.style.backgroundColor = ' #E8E6D1'
        } else {
            firstChild.style.display = 'none'
            clickable.style.backgroundColor = '#e6e6e6'
        }
    })
})

function disableButtons() {
    let buttons = document.querySelectorAll('.submitButton')
    buttons.forEach(element => {
        element.classList.add('disabled')
    })
}

//Is called when the dropdown in the updateblueprint is changed
async function pickBlueprint() {
    //Selects the right things from the DOM
    let selected = document.querySelector('#blueprintSelector')
    let div = document.querySelector('#divUpdateComponents')
    let inputUpdateBlueprintName = document.querySelector('#updatenameBlueprint')
    let inputUpdateBlueprintAmount = document.querySelector('#updateamountBlueprint')
    let inputUpdateBlueprintNote = document.querySelector('#updateNoteBlueprint')

    let blueprint = await fetch("https://dummysmeden.herokuapp.com/api/getBlueprint/" + selected.value)
    blueprint = await blueprint.json()
    inputUpdateBlueprintName.value = blueprint.name
    inputUpdateBlueprintAmount.value = blueprint.amount
    inputUpdateBlueprintNote.value = blueprint.note

    //Fetches the rigth data from API
    let values = await fetch("https://dummysmeden.herokuapp.com/api/getComponentAmounts/" + selected.value)
    let jsonValues = await values.json()
    let components = []
    for (const jsonValue of jsonValues) {
        let component = await fetch("https://dummysmeden.herokuapp.com/api/getComponentOnComponentAmount/" + jsonValue._id)

        let jsonComponent = await component.json()
        components.push(jsonComponent)
    }

    //Puts the fetched data into html-string
    let html = ''
    for (const jsonValue of jsonValues) {
        for (const component of components) {
            if (jsonValue.component == component._id) {
                html = html + '<p>' + component.name + '</p><input type="text" name="' + jsonValue._id + '" value="' + jsonValue.amount + '"> <br>'
            }
        }
    }
    html += ' <br>'
    //Puts the html string into the div
    div.innerHTML = html
}

//Is called when the dropdown in the updateproduct is changed
async function pickProduct() {
    //Selects the right things from the DOM
    let selected = document.querySelector('#productSelector')
    let div = document.querySelector('#divUpdateBlueprints')
    let inputUpdateComponentName = document.querySelector('#updatenameProduct')
    let inputUpdateComponentAmount = document.querySelector('#updateamountProduct')
    let inputUpdateComponentNote = document.querySelector('#updateNoteProduct')

    let product = await fetch("https://dummysmeden.herokuapp.com/api/getProduct/" + selected.value)
    product = await product.json()
    inputUpdateComponentName.value = product.name
    inputUpdateComponentAmount.value = product.amount
    inputUpdateComponentNote.value = product.note

    //Fetches the rigth data from API
    let values = await fetch("https://dummysmeden.herokuapp.com/api/getBlueprintAmounts/" + selected.value)

    let jsonValues = await values.json()
    let blueprints = []
    for (const jsonValue of jsonValues) {
        let blueprint = await fetch("https://dummysmeden.herokuapp.com/api/getBlueprintOnBlueprintAmount/" + jsonValue._id)
        let jsonBlueprint = await blueprint.json()
        blueprints.push(jsonBlueprint)
    }

    //Puts the fetched data into html-string
    let html = ''
    for (const jsonValue of jsonValues) {
        for (const blueprint of blueprints) {
            if (jsonValue.blueprint == blueprint._id) {
                html += '<p>' + blueprint.name + '</p><input type="text" name="' + jsonValue._id + '" value="' + jsonValue.amount + '"> <br>'
            }
        }
    }
    html += ' <br>'
    //Puts the html string into the div
    div.innerHTML = html
}

async function pickComponent() {
    let selected = document.querySelector('#componentSelector')
    let nameInput = document.querySelector('#updateComponentNameID')
    let amountInput = document.querySelector('#updateComponentAmountID')
    let noteInput = document.querySelector('#updateComponentNoteID')

    let component = await fetch('/api/getComponent/' + selected.value)

    component = await component.json()

    nameInput.value = component.name
    amountInput.value = component.amount
    noteInput.value = component.note
}

async function deleteBlueprint() {
    disableButtons()
    let div = document.getElementById('dropdownDeleteBlueprintID')
    let id = div.value
    await fetch('https://dummysmeden.herokuapp.com/api/deleteBlueprint/' + id, {
        method: 'delete'
    })
}

async function updateBlueprint() {
    if (
        !validerString.test(document.getElementById("updatenameBlueprint").value) ||
        !validerTal.test(document.getElementById("updateamountBlueprint").value) ||
        !validerString.test(document.getElementById("updateNoteBlueprint").value)
    ) {
        alert("Udfyld venligst blueprint navn, antal og note")
    } else {
        disableButtons()
        let data = "{ ";
        data = data + '"name": "' + document.getElementById("updatenameBlueprint").value + '"' +
            ", " + '"amount": ' + document.getElementById("updateamountBlueprint").value +
            ", " + '"note": "' + document.getElementById("updateNoteBlueprint").value + '",'

        let nodes = document.getElementById("divUpdateComponents").childNodes

        data += '"componentAmounts":['
        nodes.forEach(element => {
            if (element.nodeName == "INPUT") {
                data += '{"id": "' + element.name + '", "value": "' + element.value + '"}, '
            }
        });
        data = data.substring(0, data.length - 2)
        data += "]}"

        // Alt fetch
        let id = document.getElementById("blueprintSelector").value

        await fetch("https://dummysmeden.herokuapp.com/api/updateBlueprint/" + id, {
            method: "put",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).catch(error => console.log('Fetch failed'))
    }
}

async function updateComponent() {
    if (
        !validerString.test(document.getElementById("updateComponentNameID").value) ||
        !validerTal.test(document.getElementById("updateComponentAmountID").value) ||
        !validerString.test(document.getElementById("updateComponentNoteID").value)
    ) {
        alert("Indtast det nye data til komponenten")
    } else {
        disableButtons()

        let id = document.querySelector('#componentSelector').value

        let data = "{ ";
        data = data + '"name": "' + document.getElementById("updateComponentNameID").value + '"' +
            ", " + '"amount": ' + document.getElementById("updateComponentAmountID").value +
            ", " + '"note": "' + document.getElementById("updateComponentNoteID").value + '"}'

        await fetch("https://dummysmeden.herokuapp.com/api/updateComponent/" + id, {
            method: "put",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
    }
}

async function createComponent() {
    let nameInput = document.getElementById('createComponentNameID').value
    let amountInput = document.getElementById('createComponentAmountID').value
    let noteInput = document.getElementById('createComponentNoteID').value
    if (
        !validerString.test(nameInput) ||
        !validerTal.test(amountInput) ||
        !validerString.test(noteInput)
    ) {
        alert("Indtast data om komponenten")
    } else {
        disableButtons()
        let data = "{ ";
        data = data + '"name": "' + nameInput + '"' +
            ", " + '"amount": ' + amountInput +
            ", " + '"note": "' + noteInput + '"}'

        await fetch("https://dummysmeden.herokuapp.com/api/createComponent/", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
    }
}

async function deleteComponent() {
    disableButtons()
    let div = document.getElementById('dropDownDeleteID')
    let id = div.value
    await fetch('https://dummysmeden.herokuapp.com/api/deleteComponent/' + id, {
        method: 'delete'
    })
}

async function deleteProduct() {
    disableButtons()
    let div = document.getElementById('dropDownDeleteProductID')
    let id = div.value
    await fetch('https://dummysmeden.herokuapp.com/api/deleteProduct/' + id, {
        method: 'delete'
    })
}

async function updateProduct() {
    if (
        !validerString.test(document.getElementById("updatenameProduct").value) ||
        !validerTal.test(document.getElementById("updateamountProduct").value) ||
        !validerString.test(document.getElementById("updateNoteProduct").value)
    ) {
        alert("Indtast det nye data til produktet")
    } else {
        disableButtons()
        let data = "{ ";
        data = data + '"name": "' + document.getElementById("updatenameProduct").value + '"' +
            ", " + '"amount": ' + document.getElementById("updateamountProduct").value +
            ", " + '"note": "' + document.getElementById("updateNoteProduct").value + '", '

        let nodes = document.getElementById("divUpdateBlueprints").childNodes

        data += '"blueprintAmounts":['
        nodes.forEach(element => {
            if (element.nodeName == "INPUT") {
                data += '{"id": "' + element.name + '", "value": "' + element.value + '"}, '
            }
        });
        data = data.substring(0, data.length - 2)
        data += "]}"

        // Alt fetch
        let id = document.getElementById("productSelector").value

        await fetch("https://dummysmeden.herokuapp.com/api/updateProduct/" + id, {
            method: "put",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).catch(error => console.log('Fetch failed: ' + data))
    }
}

async function logout() {
    await fetch("https://dummysmeden.herokuapp.com/logout", {
        method: "get",
        redirect: "follow"
    }).then(res => {
        if (res.redirected) {
            //window.location.href = res.url
            res.redirect(301, res.url)
        }
    })
}