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
            content.style.maxHeight = content.scrollHeight + 'px'
        } else {
            content.style.maxHeight = 0
        }
    })
})

async function pickBlueprint() {
    let selected = document.querySelector('#blueprintSelector')
    let div = document.querySelector('.components')
    console.log('Div : ' + div);
    let values = await fetch("http://localhost:8080/api/getComponentAmounts/" + selected.value)
    let jsonValues = await values.json()
    console.log('JsonValues : ' + jsonValues);
    console.log('Selected blueprint : ' + selected.value);
    console.log('ComponentAmounts on the blueprint : ' + JSON.stringify(jsonValues));
    let components = []
    for (const jsonValue of jsonValues) {
        let component = await fetch("http://localhost:8080/api/getComponentOnComponentAmount/" + jsonValue._id)
        let jsonComponent = await component.json()
        components.push(jsonComponent)
        console.log('Component : ' + JSON.stringify(jsonComponent));
    }
    // jsonValues.forEach(async element => {
    //     let component = await fetch("http://localhost:8080/api/getComponentOnComponentAmount/" + element._id)
    //     let jsonComponent = await component.json()
    //     components.push(jsonComponent)
    //     console.log('Component : ' + JSON.stringify(jsonComponent));
    // })

    let html = ''
    console.log("Start");
    for (const jsonValue of jsonValues) {
        for (const component of components) {
            if(jsonValue.component == component._id) {
                console.log('Name of component : ' + component.name);

                html += '<p> Name:' + component.name + ' Amount: ' + jsonValue.amount + ' </p>'
            }
            
            
        }
        
    }
    div.innerHTML = html
    
    
}

