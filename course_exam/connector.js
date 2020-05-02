window.onload = async function () {
    const apiUrl = 'https://swapi.dev/api/'
    const main = document.getElementById('main')
    const init = {method: 'GET'}
    let mainModal = document.getElementById('main-modal')
    mainModal.classList.toggle('hidden')
    let numCheck = /\d+/
    let mainPage = document.getElementById('main page')
    let paginationBlock = document.getElementById('pagination')
    let paginationButtons = document.getElementById('pagination group')
    let prev = document.getElementById('prev')
    prev.addEventListener('click', urlResolve)
    let next = document.getElementById('next')
    next.addEventListener('click', urlResolve)
    await prefetchData(apiUrl)


    function prefetchData(url) {
        fetch(url, init)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            paginationLogic(data)
            if (data.results) {
                for (let i = 0; i < data.results.length; i++) {
                    let responseUrl = data.results[i].url ? data.results[i].url : '#'
                    let newId = data.results[i].name ? data.results[i].name : data.results[i].title
                    if (responseUrl.match(numCheck)) {
                        breadCrumbs(apiUrl)
                        paginationBlock.classList.remove("hidden")
                    }
                    let genElement = `<br/><a href="${data.results[i].url}">
                                <div class="card" id="${newId}">
                                <div class="card-header">
                                     ${newId}
                                        <div class="card-body">
                                        </div>
                                    </div>
                                </div></a>`
                    main.insertAdjacentHTML('beforeend', genElement)
                    document.getElementById(`${newId}`).addEventListener('click', urlResolve)

                }
            } else {
                for (let i in data) {
                    let genElement = `<br/><a href=${data[i]}>
                                <div class="card" id="${i}">
                                <div class="card-header">
                                     ${i}
                                    </div>
                                </div></a>`
                    main.insertAdjacentHTML('beforeend', genElement)
                    document.getElementById(`${i}`).addEventListener('click', urlResolve)
                }
            }

        })
            .catch(function (rejected) {
                alert(`Error ${rejected}`);
            })
    }

    function urlResolve(event) {
        event.preventDefault()
        let redirect = event.currentTarget.parentNode.href ? event.currentTarget.parentNode.href : event.target.href
        if (redirect.match(numCheck) && !redirect.includes('?')) {
            detailView(redirect)
            return
        }
        let allCardBlocks = document.body.getElementsByClassName('card');
        clearBlock(allCardBlocks)
        prefetchData(redirect)
        if (event.target.id === 'main page') {
            window.scroll(top)
            mainPage.innerText = ''
            paginationBlock.classList.add('hidden')
        }
    }

    function clearBlock(elements) {
        do {
            elements[0].remove()
        } while (elements.length)
    }

    function breadCrumbs(url) {
        mainPage.href = url
        mainPage.innerText = 'Back to main menu'
        mainPage.addEventListener('click', urlResolve)
    }

    function paginationLogic(data) {
        if (data.hasOwnProperty('previous') && data.previous !== null) {
            prev.href = data.previous
            prev.classList.remove('hidden')
        } else prev.classList.add('hidden')
        if (data.hasOwnProperty('next') && data.next !== null) {
            next.href = data.next
            next.classList.remove('hidden')
        } else next.classList.add('hidden')
        if (data.hasOwnProperty('previous') && data.hasOwnProperty('next')) {
            let paginationBtns = document.getElementsByClassName('btn-secondary')
            if (paginationBtns.length) {
                clearBlock(paginationBtns)
            }
            let counter = 1
            do {
                data.count -= 10
                let linkGenerator = next.href.replace(numCheck, counter)
                let button = `<a href=${linkGenerator}><button type="button" class="btn-secondary" id="page counter ${counter}">
                              ${counter}</button></a>`
                paginationButtons.insertAdjacentHTML('beforeend', button)
                document.getElementById(`page counter ${counter}`).addEventListener('click', urlResolve)
                counter++
            } while (data.count > 0)
        }
    }

    async function detailView(url) {
        fetch(url, init)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            let oldModal = document.getElementById('modal')
            if (oldModal && oldModal.children) {
                oldModal.remove()
            }
            let newModal = `<div class="modal-content hidden" id="modal">
                                <span class="close-window" id="close">&times;</span>
                            </div>`
            document.getElementsByClassName('modal-window')[0].insertAdjacentHTML('beforeend', newModal)
            let modal = document.getElementById('modal')
            document.getElementById('close').addEventListener('click', closeModal)
            for (let i in data) {
                if (data[i] instanceof Array) {
                    let block = `<div class="card card-body" id="${i}"><p>${i} block</p></div>`
                    modal.insertAdjacentHTML('beforeend', block)
                    for (let j = 0; j < data[i].length; j++) {
                        let newContent = `<a href=${data[i][j]}>${i} link</a>`
                        let blocItself = document.getElementById(`${i}`)
                        blocItself.insertAdjacentHTML('beforeend', newContent)
                        document.getElementById(`${i}`).addEventListener('click', urlResolve)
                    }
                } else if (String(data[i]).includes('http')) {
                    let newContent = `<a href="${data[i]}" id="${data[i]}">${i}</a>`
                    modal.insertAdjacentHTML('beforeend', newContent)
                    document.getElementById(`${data[i]}`).addEventListener('click', urlResolve)
                } else {
                    let newContent = document.createElement('p').innerText = `<p>${i} : ${data[i]}</p></br>`
                    modal.insertAdjacentHTML('beforeend', newContent)
                }
            }
            modal.classList.remove('hidden')
            mainModal.classList.remove('hidden')
        })
            .catch(function (rejected) {
                alert(`error ${rejected}`)
            })
    }
    function closeModal() {
        document.getElementById('modal').style.display = 'none'
    }
}

