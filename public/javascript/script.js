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


//Is called when the dropdown in the updateblueprint is changed
async function pickBlueprint() {
    //Selects the right things from the DOM
    let selected = document.querySelector('#blueprintSelector')
    let div = document.querySelector('#divUpdateComponents')

    //Fetches the rigth data from API
    let values = await fetch("http://dummysmeden.herokuapp.com/api/getComponentAmounts/" + selected.value)
    let jsonValues = await values.json()
    let components = []
    for (const jsonValue of jsonValues) {
        let component = await fetch("http://dummysmeden.herokuapp.com/api/getComponentOnComponentAmount/" + jsonValue._id)
        let jsonComponent = await component.json()
        components.push(jsonComponent)
        console.log('Component : ' + JSON.stringify(jsonComponent));
    }

    //Puts the fetched data into html-string
    let html = ''
    for (const jsonValue of jsonValues) {
        for (const component of components) {
            if(jsonValue.component == component._id) {
                console.log('Name of component : ' + component.name);

                html += '<p>' + component.name + '</p><input type="text" name="' + component._id + '" value="' + jsonValue.amount + '"> <br>'
            }
            
            
        }
        
    }
    //Puts the html string into the div
    div.innerHTML = html
    // div.style.overflow = "auto"
    
    
}

