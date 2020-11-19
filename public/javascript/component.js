// på eget ansvar
document.querySelectorAll('.collapsibleButton').forEach(button =>{
    button.addEventListener('click', () =>{
        const content = button.nextElementSibling

        button.classList.toggle('collapsibleButton--active')

        if(button.classList.contains('collapsibleButton--active')){
            content.style.maxHeight=content.scrollHeight+'px'
        } else {
            content.style.maxHeight = 0
        }
    })
})