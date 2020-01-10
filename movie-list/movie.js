(function() {
  const BASE_URL = "https://movie-list.alphacamp.io";
  const INDEX_URL = BASE_URL + "/api/v1/movies/";
  const POSTER_URL = BASE_URL + "/posters/";
  const data = [];
  const dataPanel = document.getElementById("data-panel");
  const searchForm = document.getElementById("search");
  const searchIput = document.getElementById("search-input");
  const pagination = document.getElementById("pagination");
  const ITEM_PER_PAGE = 12;
  const displaymode = document.getElementById("display-mode");
  const modalContent = document.getElementById("modalContent");

  let paginationData = [];
  let currentPage; // 設定currentPage方便之後於localStorage調整目前頁面
  let currentType;
  let currentResults;

  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results);
      // displayDataList(data)
      getTotalPages(data);
      getPageData(1, data, "card");
      localStorage.setItem("page", 1);
      localStorage.setItem("type", "card");
      localStorage.setItem("results", JSON.stringify(data));
      currentPage = localStorage.getItem("page");
      currentType = localStorage.getItem("type");
      currentResults = JSON.parse(localStorage.getItem("results"));
    })
    .catch(err => console.log(err));

  //function

  //display card mode
  function displayDataList(data) {
    let htmlContent = "";
    data.forEach(function(item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>

              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>

            </div>
          </div>
        </div>
      `;
    });
    dataPanel.innerHTML = htmlContent;
  }

  //display list mode

  function displayListMode(data) {
    let htmlContent = "";
    data.forEach(item => {
      htmlContent += `
        <div class="container">
          <hr>
          <div class="row list py-1">
            <div class="col-sm-9 pt-2">
              <h6 class="card-title">${item.title}</h6>
            </div>
            <!-- "More" button -->
            <div class="col-sm-3">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `;
    });
    dataPanel.innerHTML = htmlContent;
  }

  //將電影加入最愛
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const movie = data.find(item => item.id === Number(id));
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`);
    } else {
      list.push(movie);
      alert(`Added ${movie.title} to your favorite list!`);
    }
    localStorage.setItem("favoriteMovies", JSON.stringify(list));
  }

  //電影詳細
  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById("show-movie-title");
    const modalImage = document.getElementById("show-movie-image");
    const modalDate = document.getElementById("show-movie-date");
    const modalDescription = document.getElementById("show-movie-description");

    // set request url
    const url = INDEX_URL + id;
    // console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results;
      // console.log(data)
      // insert data into modal ui
      modalTitle.textContent = data.title;
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`;
      modalDate.textContent = `release at : ${data.release_date}`;
      modalDescription.textContent = `${data.description}`;
    });
  }

  //顯示總頁面
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
    let pageItemContent = "";
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i +
        1}</a>
        </li>
      `;
    }
    pagination.innerHTML = pageItemContent;
  }

  //顯示特定頁面
  function getPageData(pageNum, data, type) {
    paginationData = data || paginationData;
    let offset = (pageNum - 1) * ITEM_PER_PAGE;
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
    if (type === "list") {
      displayListMode(pageData);
    } else if (type === "card") {
      displayDataList(pageData);
    }
  }

  // 監聽器設置

  dataPanel.addEventListener("click", event => {
    if (event.target.matches(".btn-show-movie")) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches(".btn-add-favorite")) {
      addFavoriteItem(event.target.dataset.id);
    }
  });

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const regex = new RegExp(searchIput.value, "i");
    let results = [];
    results = data.filter(movie => movie.title.match(regex));
    console.log(results);
    // displayDataList(results)
    getTotalPages(results);
    getPageData(1, results, localStorage.getItem("type"));
    localStorage.setItem("results", JSON.stringify(results));

    let searchInput = document.getElementById("search-input");
    searchInput.value = "";
  });

  displaymode.addEventListener("click", () => {
    currentPage = localStorage.getItem("page");
    currentResults = JSON.parse(localStorage.getItem("results"));
    if (event.target.matches(".list-mode")) {
      localStorage.setItem("type", "list");
      currentType = localStorage.getItem("type");
      getPageData(currentPage, currentResults, currentType);
      console.log("list");
    } else if (event.target.matches(".card-mode")) {
      localStorage.setItem("type", "card");
      currentType = localStorage.getItem("type");
      getPageData(currentPage, currentResults, currentType);
      console.log("card");
    }
  });

  pagination.addEventListener("click", event => {
    currentPage = event.target.dataset.page;
    currentType = localStorage.getItem("type");
    currentResults = JSON.parse(localStorage.getItem("results"));
    if (event.target.tagName === "A") {
      getPageData(currentPage, currentResults, currentType);
      localStorage.setItem("page", currentPage);
    }
  });

  // fade out
  function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  window.addEventListener("load", () => {
    const loaderWrapper = document.querySelector(".loader-wrapper");
    fadeOut(loaderWrapper);
  });
})();
