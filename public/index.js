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

const renderSearchedMovie = (searchData) => {
  const searchMarkup = `
      <img class="search-section__img" src=${searchData.Poster}>
      <ul class="search-section__info">
        <h1 class="search-section__list__title" id="movie-title">${searchData.Title}</h1>
        <li>IMBD rating: ${searchData.imdbRating}</li>
        <li>Released: ${searchData.Released}</li>
        <li>Starting: ${searchData.Actors}</li>
        <li>Genre: ${searchData.Genre}</li>
        <li>Director: ${searchData.Director}</li>
        <li>Country: ${searchData.Country}</li>
        <li>Language: ${searchData.Language}</li>
        <li>Plot: ${searchData.Plot}</li>
        <button class="search-section__button btn" id="addbutton" onClick="createMovieObject()">Add to favorites</button>
      <ul>`;
  movieBlock.innerHTML = searchMarkup;
};

const clearSearchedMovieSection = () => {
  movieBlock.innerHTML = '';
};

const renderWrongTiteText = (data) => {
  document.getElementById('wrongtitle').innerHTML = `<h3>Hmm 🤔...something went wrong. ${data.Error}</h3>`;
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

const loadFavoritesList = (movieToAdd) => {
  for (let i = 0; i < movieToAdd.favoritesList.length; i += 1) {
    const favoritesMarkup = `<li class="a-favorite-movie" data-key="${movieToAdd.favoritesList[i].id}">
      <h4 class="a-favorite-movie-title">${movieToAdd.favoritesList[i].title}</h4>
      <button class="a-favorite-movie-remove-button ">X</button>
    </li>`;
    list.insertAdjacentHTML('beforeend', favoritesMarkup);
  }
};

const SendDataToServer = (movieData) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movieData),
  };
  fetch('/data', options)
    .catch((err) => errorText(err));
};

const addAMovieToFavoritesList = (movieToAdd) => {
  const favoritesMarkup = `<li class=""a-favorite-movie" data-key="${movieToAdd.id}">
    <h4 class="a-favorite-movie-title">${movieToAdd.title}</h4>
    <button class="a-favorite-movie-remove-button ">X</button>
    </li>`;
  list.insertAdjacentHTML('beforeend', favoritesMarkup);
};

const createMovieObject = () => {
  const movie = {
    title: document.getElementById('movie-title').innerHTML,
    id: Date.now(),
  };
  SendDataToServer(movie);
  addAMovieToFavoritesList(movie);
  clearSearchedMovieSection();
};

const renderFavoritesListOnLoad = () => {
  fetch('/data')
    .then(handleErrors)
    .then((res) => res.json())
    .then((movieToAdd) => {
      loadFavoritesList(movieToAdd);
    })
    .catch((err) => errorText('Here', err));
};
renderFavoritesListOnLoad();

const removeMovie = (key) => {
  const item = document.querySelector(`[data-key='${key}']`);
  const toRemoveMovieId = { id: item.getAttribute('data-key') };
  item.remove();
  SendDataToServer(toRemoveMovieId);
};

list.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  const itemKey = event.target.parentElement.dataset.key;
  removeMovie(itemKey);
});
