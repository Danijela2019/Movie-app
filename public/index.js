const form = document.querySelector('#form');
const movieBlock = document.querySelector('#movies');
const list = document.querySelector('#favorites-ul');
const input = document.querySelector('#form-input');

const handleErrors = (res) => {
  if (!res.ok) throw Error(res.statusText);
  return res;
};

const errorText = (error) => {
  document.getElementById(
    'wrongtitle',
  ).innerHTML = `<h3>'Ooops..something went wrong: ${error}</h3>`;
};

const loadFavoritesList = (data) => {
  for (let i = 0; i < data.favoritesList.length; i += 1) {
    const favoritesMarkup = `<li class="a-favorite-movie" data-key="${data.favoritesList[i].id}">
      <h4 class="a-favorite-movie-title">${data.favoritesList[i].title}</h4>
      <button class="a-favorite-movie-remove-button ">X</button>
    </li>`;
    list.insertAdjacentHTML('beforeend', favoritesMarkup);
  }
};

const renderFavoritesListOnLoad = () => {
  fetch('/data')
    .then(handleErrors)
    .then((res) => res.json())
    .then((favMoviesData) => {
      loadFavoritesList(favMoviesData);
    })
    .catch((err) => errorText('Error fetching data from the server', err));
};
renderFavoritesListOnLoad();

const clearSearchedMovieSection = () => {
  movieBlock.innerHTML = '';
};

const renderWrongTiteText = (data) => {
  document.getElementById(
    'wrongtitle',
  ).innerHTML = `<h3>Hmm 🤔...something went wrong. ${data.Error}</h3>`;
};

const renderMoviesList = (movieData, renderList) => {
  for (let a = 0; a < 10; a += 1) {
    const Markup = `<li class="movie-card l-container-row">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <img src=https://image.tmdb.org/t/p/w200/${movieData[a].poster_path}>
            </div>
            <div class="flip-card-back">
              <h1 class="flip-card-title">${movieData[a].title}</h1>
              <p class="flip-card-text">${movieData[a].overview}</p>
          </div>
          </div>
        </div>
      </li>`;
    renderList.insertAdjacentHTML('beforeend', Markup);
  }
};

const fetchMovies = () => {
  fetch('/api/movies')
    .then(handleErrors)
    .then((res) => res.json())
    .then((finaldata) => {
      const popularData = finaldata.popular.results;
      const upcomingData = finaldata.upcoming.results;
      const popularMovies = document.querySelector('#popular');
      const upcomingMovies = document.querySelector('#upcoming');
      renderMoviesList(popularData, popularMovies);
      renderMoviesList(upcomingData, upcomingMovies);
    })
    .catch((err) => errorText(err));
};
fetchMovies();

const renderSearchedMovie = (searchData) => {
  const searchMarkup = `
      <img class="search-section__img" src=${searchData.Poster}>
      <div class="search-section__info">
        <h1 class="search-section__list__title" id="movie-title">${searchData.Title}</h1>
        <p>IMBD rating: ${searchData.imdbRating}</p>
        <p>Released: ${searchData.Released}</p>
        <p>Starting: ${searchData.Actors}</p>
        <p>Genre: ${searchData.Genre}</p>
        <p>Director: ${searchData.Director}</p>
        <p>Country: ${searchData.Country}</p>
        <p>Language: ${searchData.Language}</p>
        <p>Plot: ${searchData.Plot}</p>
        <button class="search-section__button btn" id="addbutton" onClick="createMovieObject()">Add to favorites</button>
      <div>`;
  movieBlock.innerHTML = searchMarkup;
};

const fetchSearchedMovie = (movieData) => {
  fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData),
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response !== 'False') {
        renderSearchedMovie(data);
        input.value = '';
      } else {
        renderWrongTiteText(data);
      }
    })
    .catch((err) => errorText(err));
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearSearchedMovieSection();
  if (input.value !== '') {
    document.getElementById('wrongtitle').innerHTML = '';
    const getSearhedMovie = { movieinput: input.value };
    fetchSearchedMovie(getSearhedMovie);
  }
});

const addAMovieToFavoritesList = (movieToAdd) => {
  const favoritesMarkup = `<li class=""a-favorite-movie" data-key="${movieToAdd.id}">
    <h4 class="a-favorite-movie-title">${movieToAdd.title}</h4>
    <button class="a-favorite-movie-remove-button ">X</button>
    </li>`;
  list.insertAdjacentHTML('beforeend', favoritesMarkup);
};

const sendDataToServer = (movieData) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movieData),
  };
  fetch('/data', options).catch((err) => errorText(err));
};

const renderDuplicateMovieAdded = () => {
  document.getElementById('wrongtitle').innerHTML = '<h3>Hmm 🤔...seems like this movie is already on your list.';
};

const checkForDuplicates = (movieTitle) => {
  const lengthFixed = list.children.length;
  const moviesArray = [];
  for (let i = 0; i < lengthFixed; i += 1) {
    const p = list.children[i].children[0].innerText;
    moviesArray.push(p);
  }
  return moviesArray.includes(movieTitle);
};

const createMovieObject = () => {
  const movie = {
    title: document.getElementById('movie-title').innerHTML,
    id: Date.now(),
  };
  const { title } = movie;
  if (checkForDuplicates(title)) {
    renderDuplicateMovieAdded();
    clearSearchedMovieSection();
  } else {
    addAMovieToFavoritesList(movie);
    sendDataToServer(movie);
    clearSearchedMovieSection();
  }
};

const removeMovie = (key) => {
  const item = document.querySelector(`[data-key='${key}']`);
  const toRemoveMovieId = { id: item.getAttribute('data-key') };
  item.remove();
  sendDataToServer(toRemoveMovieId);
};

list.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  const itemKey = event.target.parentElement.dataset.key;
  removeMovie(itemKey);
});
