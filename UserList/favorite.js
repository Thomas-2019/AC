(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

  const dataPanelFavorite = document.getElementById('data-panel-favorite')
  const datalocal = JSON.parse(localStorage.getItem('favoriteList')) || []

  displayDataListFavorite(datalocal)

  function displayDataListFavorite(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2 p-1">

            <img class = "card-img-top rounded-circle"
            data-toggle = "modal"
            data-target = "#show-modal"
            data-id = "${item.id}"
            src = "${item.avatar}"
            alt = "Card image cap"
            style = "cursor: pointer">
            <div class="card-body item-body">
              <h6 class="card-title text-center">${item.name} ${item.surname}</h5>
            <!-- favorite button --> 
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>

          </div>
        </div>
      `
    })
    dataPanelFavorite.innerHTML = htmlContent
  }

  dataPanelFavorite.addEventListener('click', event => {
    clearShow()
    if (event.target.matches('.card-img-top')) {
      show(event.target.dataset.id)
      //console.log(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavorite(event.target.dataset.id)
    }
  })

  function removeFavorite(id) {
    const index = datalocal.findIndex(item => item.id === Number(id))
    if (index === -1) return
    console.log(index)
    datalocal.splice(index, 1)
    console.log(datalocal)
    localStorage.setItem('favoriteList', JSON.stringify(datalocal))

    displayDataListFavorite(datalocal)
  }

  function show(id) {

    // get elements
    const Title = document.getElementById('title')
    const Image = document.getElementById('image')
    const bodyContent = document.querySelector('#body-content')

    // set request url
    const url = BASE_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data
      console.log(data)
      // insert data into modal ui

      Title.innerText = `${data.name} ${data.surname}`
      Image.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
      bodyContent.innerHTML = `
                            <p>Age: ${data.age}</p>
                            <p>Gender: ${data.gender}</p>
                            <p>Region: ${data.region}</p>
                            <p>Birthday: ${data.birthday}</p>
                            <p>Email: ${data.email}</p>`
    })
  }

  function clearShow() {
    const Image = document.getElementById('image')
    const bodyContent = document.querySelector('#body-content')
    Image.innerText = ''
    bodyContent.innerText = ''
  }
})()