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
            setTimeout(function () { console.log('venter på transition') }, 200);
            content.style.borderBottom = '1px solid black'
            firstChild.style.display = 'block'

        } else {
            content.style.maxHeight = 0
            setTimeout(function () { console.log('venter på transition 2') }, 200);
            firstChild.style.display = 'none'
            content.style.borderBottom = 'none'
        }
    })
})
