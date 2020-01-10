(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 16
  const card = document.getElementById('card')
  const list = document.getElementById('list')
  let paginationData = []
  let page = 1
  let displayMode = 'card'
  // ...

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    // console.log(data)
    // display(data)
    getTotalPages(data)
    getPageData(page, data)

  }).catch((err) => console.log(err))



  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }



  // ...
  function getPageData(pageNum, data, displayMode) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    // console.log(pageData)
    console.log(displayMode)
    // displayMode='list'
    display(pageData, displayMode)
  }


  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }


  function display(data, displayMode) {
    let displayContent = ''

    if (displayMode === 'card' || displayMode === undefined) {
      data.forEach(item => {
        displayContent += `
          <div class="col-sm-3">
            <div class="card mb-2">
              <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
              <div class="card-body movie-item-body">
                <h6 class="card-title">${item.title}</h6>
              </div>
  
              <!-- "More" button -->
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
  
                <!-- favorite button --> 
              <button class = "btn btn-info btn-add-favorite"
              data-id="${item.id}"> + </button>
              </div>
  
            </div>
          </div>
        `
      })
      dataPanel.innerHTML = displayContent
      console.log('dataPanel:card mode')

    } else if (displayMode === 'list') {

      data.forEach(item => {
        displayContent += `
              <div class="col-12 mb-2 border-bottom p-1 row">
                <span class="col-6 col-sm-8 col-lg-10">${item.title}</span>
                <span class = "col-6 col-sm-4 col-lg-2">
                  <!-- "More" button -->
                  <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                  
                  <!-- favorite button --> 
                  <button class = "btn btn-info btn-add-favorite"
                  data-id="${item.id}"> + </button>
                </span>
              </div>`
      });
      dataPanel.innerHTML = displayContent
      console.log('dataPanel:list mode')
    }
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      // console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }


  card.addEventListener('click', e => {
    e.preventDefault()
    displayMode = 'card'
    getPageData(page, data, displayMode)
    // display(data, displayMode)
    // console.log(displayMode)
  })

  list.addEventListener('click', e => {
    e.preventDefault()
    displayMode = 'list'
    getPageData(page, data, displayMode)
    // display(data, displayMode)
    // console.log(displayMode)
  })

  pagination.addEventListener('click', event => {
    // console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      // displayMode='list'
      getPageData(event.target.dataset.page, data, displayMode)
      // console.log(displayMode)
    }
  })

  // listen to search btn click event

  searchInput.addEventListener('keyup', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    // console.log(results)
    // console.log(displayMode)
    // display(results)
    getTotalPages(results)
    getPageData(page, results, displayMode)
  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

})()