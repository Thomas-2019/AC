(function () {
  // new variable
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
  const dataPanel = document.getElementById('data-panel')
  const card = document.getElementById('card')
  const list = document.getElementById('list')
  let paginationData = []
  const ItemPageCount = 16
  const data = []
  const pagination = document.getElementById('pagination')
  const search = document.getElementById('search')
  let result = []
  const page = 1
  let paginationPage = page
  let displayMode = 'card'
  const navbarNav = document.querySelector('.navbar-nav')
  let menu = 'home'
  const datalocal = JSON.parse(localStorage.getItem('favoriteList')) || []
  const male = document.querySelector('#male')
  const female = document.querySelector('#female')
  let AllManData = []
  let AllWomanData = []



  navbarNav.addEventListener('click', e => {
    if (e.target.matches('#male')) {
      getAllPage(AllManData)
      getPageData(paginationPage, AllManData, displayMode, menu)

    } else if (e.target.matches('#female')) {
      getAllPage(AllWomanData)
      getPageData(paginationPage, AllWomanData, displayMode, menu)
    }

    for (let item of navbarNav.children) {
      // console.log(item.firstElementChild.classList)
      item.firstElementChild.classList.remove('blue')
    }
    e.target.classList.add('blue')
  })

  function gender(data) {
    AllManData = data.filter(user => user.gender === 'male')
    AllWomanData = data.filter(user => user.gender === 'female')
    male.innerText = `MALE (${AllManData.length})`
    female.innerText = `FEMALE (${AllWomanData.length})`
  }

  axios.get(BASE_URL).then((response) => {
    data.push(...response.data.results)
    gender(data)
    // displayData(data) // add this
    getPageData(page, data, displayMode, menu)
  }).catch((err) => console.log(err))

  // listen to data panel
  function addFavorite(id) {
    const member = data.find(item => item.id === Number(id))
    // console.log(member)
    if (datalocal.some(item => item.id === Number(id))) {
      console.log(`${member.name} is already in your favorite list.`)
    } else {
      datalocal.push(member)
      console.log(`Added ${member.name}to your favorite list~`)
    }
    localStorage.setItem('favoriteList', JSON.stringify(datalocal))
  }

  function removeFavorite(id) {
    const index = datalocal.findIndex(item => item.id === Number(id))
    // console.log(index)
    if (index === -1) return
    datalocal.splice(index, 1)
    // console.log(datalocal)
    localStorage.setItem('favoriteList', JSON.stringify(datalocal))

    displayData(datalocal, displayMode, menu)
  }

  function getAllPage(data) {
    let AllPages = Math.ceil(data.length / ItemPageCount) || 1
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

  function getPageData(pageNum, data, displayMode, menu) {
    // console.log(menu)
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ItemPageCount
    let pageData = paginationData.slice(offset, offset + ItemPageCount)
    console.log(displayMode)
    if (displayMode === 'card') {
      displayDataCard(pageData, displayMode, menu)
    } else if (displayMode === 'list') {
      displayDataList(pageData, displayMode, menu)
    }
  }

  // SKIP (accessing data by axios)
  function displayDataCard(data) {
    // console.log(displayMode)
    let DataContent = ''
    data.forEach(item => {
      DataContent += `
        <div class="col-sm-3 mb-2">
          <div class="card dataHover p-1">
            <img class = "card-img-top rounded-circle"
            data-toggle = "modal"
            data-target = "#show-modal"
            data-id = "${item.id}" style="cursor:pointer"
            src = "${item.avatar}"
            alt = "Card image cap">
            <div class="card-body item-body text-center">
              <span class="card-title">${item.name} ${item.surname}</span>
              <i class="fas fa-heart fa-lg btn-add-favorite" id="heartRed"  data-id="${item.id}"></i>
            </div>
          </div>
        </div>`
    })
    dataPanel.innerHTML = DataContent
    // console.log(dataPanel)
  }


  function displayDataList(data) {
    let DataContent = ''
    data.forEach(item => {
      DataContent += `
            <div class="col-12 mb-2 p-1 border-bottom dataHover">
              <span class="float-left col-11">
                <img class="card-img-left rounded-circle" style="width:60px ;cursor:pointer" data-toggle="modal" data-target="#show-modal" data-id="${item.id}" src="${item.avatar}" alt="Card image cap" style="cursor: pointer">
                <span class="card-title ml-2">${item.name} ${item.surname}</span>
              </span>
              <i class="float-right col-1 fas fa-heart fa-lg btn-add-favorite" id="heartRed" style="line-height: 60px" data-id="${item.id}"></i>
            </div>`
    })
    dataPanel.innerHTML = DataContent
    // console.log(dataPanel)
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
    // clearShow()
  }

  function clearShow() {
    const Image = document.getElementById('image')
    const bodyContent = document.querySelector('#body-content')
    Image.innerText = ''
    bodyContent.innerText = ''
  }

  card.addEventListener('click', e => {
    displayMode = 'card'
    //判斷search和card-list切換時機
    if (result.length > 0) {
      //如果search有資料輸出result
      getAllPage(result)
      getPageData(page, result, displayMode, menu)
    } else {
      //沒有輸出data
      getAllPage(data)
      getPageData(paginationPage, data, displayMode, menu)
    }

    e.target.classList.add('blue')
    list.classList.remove('blue')
  })

  list.addEventListener('click', e => {
    // console.log(e.target.id)
    displayMode = 'list'
    //判斷search和card-list切換時機
    if (result.length > 0) {
      //如果search有資料輸出result
      getAllPage(result)
      getPageData(page, result, displayMode, menu)
    } else {
      //沒有輸出data
      getAllPage(data)
      getPageData(paginationPage, data, displayMode, menu)
    }


    e.target.classList.add('blue')
    list.classList.remove('blue')
  })

  search.addEventListener('keyup', event => {
    event.preventDefault()
    // console.log(data)
    const regex = new RegExp(search.value, 'i')
    result = data.filter(person => person.name.match(regex))
    getAllPage(result)
    getPageData(page, result, displayMode, menu)
    // displayData(result)
  })

  pagination.addEventListener('click', event => {
    // console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      // console.log(event.target.dataset.page)
      paginationPage = event.target.dataset.page
      getPageData(paginationPage, data, displayMode, menu)
    }
  })


  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.rounded-circle')) {
      show(event.target.dataset.id)
    }

    if (event.target.matches('.btn-add-favorite')) {
      addFavorite(event.target.dataset.id)
    } else {
      removeFavorite(event.target.dataset.id)
    }
  })

  navbarNav.addEventListener('click', e => {
    if (e.target.matches('#home')) {
      menu = 'home'
      getAllPage(data)
      getPageData(paginationPage, data, displayMode, menu)
    } else if (e.target.matches('#favorite')) {
      menu = 'favorite'
      getAllPage(datalocal)
      getPageData(paginationPage, datalocal, displayMode, menu)
    }
  })

  function RedHeart(target) {
    target.style.color = 'red'
    console.log(target.dataset.id)

    // if (classlist[3] === 'btn-add-favorite') {
    // } else if (classlist[3] === 'btn-remove-favorite') {
    //   classlist.remove('active')
    // }
  }
})()