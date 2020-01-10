(function () {
  // new variable
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
  const dataPanel = document.getElementById('data-panel-home')

  const data = []
  axios.get(BASE_URL).then((response) => {
    //方法1
    data.push(...response.data.results)
    //console.log(data)
    displayDataList(data) // add this
    //方法2
    // for(let item of response.data.results){
    //   data.push(item)
    // console.log(data)
    getAllPage(data)
    getPageData(1, data)
    //   displayDataList(data)
    // }
  }).catch((err) => console.log(err))

  // listen to data panel

  dataPanel.addEventListener('click', (event) => {
    clearShow()
    // console.log(Boolean(event.target.dataset.id))
    if (event.target.matches('.card-img-top')) {
      show(event.target.dataset.id)
      //console.log(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavorite(event.target.dataset.id)
    }
  })

  function addFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteList')) || []
    const member = data.find(item => item.id === Number(id))
    console.log(member)

    if (list.some(item => item.id === Number(id))) {
      console.log(`${member.name} is already in your favorite list.`)
    } else {
      list.push(member)
      console.log(`Added ${member.name}to your favorite list~`)
    }
    localStorage.setItem('favoriteList', JSON.stringify(list))
  }

  const pagination = document.querySelector('#pagination')

  function getAllPage(data) {
    let AllPages = Math.ceil(data.length / 12) || 1
    let pageContent = ''
    for (let i = 0; i < AllPages; i++) {
      pageContent += `
      <li class="page-item">
        <a class="page-link"
        href="javascript:;"
        data-page="${i+1}">${i+1}
        </a>
      </li>
      `
    }
    pagination.innerHTML = pageContent
  }

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  let paginationData = []

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * 12
    let pageData = paginationData.slice(offset, offset + 12)
    displayDataList(pageData)
  }

  const search = document.querySelector('#search')



  search.addEventListener('keyup', event => {
    let result = []
    event.preventDefault()
    console.log(data)
    const regex = new RegExp(search.value, 'i')
    result = data.filter(person => person.name.match(regex))
    console.log(result)

    displayDataList(result)
  })


  // SKIP (accessing data by axios)

  function displayDataList(data) {
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
            <button class="btn btn-info  btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function show(id) {

    // get elements
    const Title = document.getElementById('title')
    const Image = document.getElementById('image')
    const bodyContent = document.querySelector('#body-content')

    // set request url
    const url = BASE_URL + id
    //console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data
      // console.log(data)
      // insert data into modal ui

      Title.innerHTML = `${data.name} ${data.surname}`
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