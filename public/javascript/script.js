
// på eget ansvar
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
        let content = firstChild.children[0]

        clickable.classList.toggle('name--active')

        if (clickable.classList.contains('name--active')) {
            // firstChild.style.maxHeight = content.scrollHeight + 'px'
            // setTimeout(function () { console.log('venter på transition') }, 200);
            firstChild.style.display = 'block'

        } else {
            // firstChild.style.maxHeight = 0
            // setTimeout(function () { console.log('venter på transition 2') }, 200);
            firstChild.style.display = 'none'
        }
    })
})


//Is called when the dropdown in the updateblueprint is changed
async function pickBlueprint() {
    //Selects the right things from the DOM
    let selected = document.querySelector('#blueprintSelector')
    let div = document.querySelector('#divUpdateComponents')

    //Fetches the rigth data from API
    let values = await fetch("http://localhost:8080/api/getComponentAmounts/" + selected.value)
    let jsonValues = await values.json()
    let components = []
    for (const jsonValue of jsonValues) {
        let component = await fetch("http://localhost:8080/api/getComponentOnComponentAmount/" + jsonValue._id)
        let jsonComponent = await component.json()
        components.push(jsonComponent)
        console.log('Component : ' + JSON.stringify(jsonComponent));
    }

    //Puts the fetched data into html-string
    let html = ''
    for (const jsonValue of jsonValues) {
        for (const component of components) {
            if (jsonValue.component == component._id) {
                console.log('Name of component : ' + component.name);

                html += '<p>' + component.name + '</p><input type="text" name="' + jsonValue._id + '" value="' + jsonValue.amount + '"> <br>'
            }


        }

    }

    //Puts the html string into the div
    div.innerHTML = html
    // div.style.overflow = "auto"
}

//Is called when the dropdown in the updateproduct is changed
async function pickProduct() {
    //Selects the right things from the DOM
    let selected = document.querySelector('#productSelector')
    let div = document.querySelector('#divUpdateBlueprints')
    let inputUpdateComponentName = document.querySelector('#updateComponentNameID')
    let inputUpdateComponentAmount = document.querySelector('#updateComponentNameID')
    let inputUpdateComponentStorageMin = document.querySelector('#updateComponentNameID')

    let product = await fetch("http://localhost:8080/api/getProduct/" + selected.value)
    console.log(product);
    inputUpdateComponentName.value = product.name
    inputUpdateComponentAmount.value = product.amount
    inputUpdateComponentStorageMin.value = product.storageMin

    //Fetches the rigth data from API
    let values = await fetch("http://localhost:8080/api/getBlueprintAmounts/" + selected.value)

    let jsonValues = await values.json()
    let blueprints = []
    for (const jsonValue of jsonValues) {
        let blueprint = await fetch("http://localhost:8080/api/getBlueprintOnBlueprintAmount/" + jsonValue._id)
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
    //Puts the html string into the div
    div.innerHTML = html
    // div.style.overflow = "auto"
}

async function deleteBlueprint() {
    let div = document.getElementById('dropdownDeleteBlueprintID')
    let id = div.value
    await fetch('http://localhost:8080/api/deleteBlueprint/' + id, {
        method: 'delete'
    }).then(console.log("Blueprint er Slettet")).then(setTimeout(() => {
        window.location.reload()
    }, 100))
}

async function updateBlueprint() {
    let data = "{ ";
    data = data + '"name": "' + document.getElementById("updatenameBlueprint").value + '"' +
        ", " + '"amount": ' + document.getElementById("updateamountBlueprint").value +
        ", " + '"storageMin": ' + document.getElementById("updateMinAntalBlueprint").value + ", "

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

    await fetch("http://localhost:8080/api/updateBlueprint/" + id, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then(res => {
        return res.json()
    }).catch(error => console.log('Fetch failed'))
}

async function deleteComponent() {
    let div = document.getElementById('dropDownDeleteID')
    let id = div.value
    await fetch('http://localhost:8080/api/deleteComponent/' + id, {
        method: 'delete'
    }).then(window.location.reload())
}

async function deleteProduct() {
    let div = document.getElementById('dropDownDeleteProductID')
    let id = div.value
    await fetch('http://localhost:8080/api/deleteProduct/' + id, {
        method: 'delete'
    }).then(window.location.reload())
}

async function updateProduct() {
    let data = "{ ";
    data = data + '"name": "' + document.getElementById("updatenameProduct").value + '"' +
        ", " + '"amount": ' + document.getElementById("updateamountProduct").value +
        ", " + '"storageMin": ' + document.getElementById("updateminProduct").value + ", "

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

    console.log("Tries to fetch");
    await fetch("http://localhost:8080/api/updateProduct/" + id, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then(res => {
        return res.json()
    }).catch(error => console.log('Fetch failed: ' + data))
}