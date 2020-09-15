const form = document.querySelector('#form');
const movieBlock = document.querySelector('#movies');
const list = document.querySelector('#favorites-ul');
const input = document.querySelector('#form-input');
const favoriteMoviesArray = [];
let movie = {};

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
        <button class="search-section__button" id="addbutton" onClick="addFavoriteMovie()">Add to favorites</button>
      <ul>`;
  movieBlock.innerHTML = searchMarkup;
};

const clearSearchedMovieSection = () => {
  movieBlock.innerHTML = '';
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearSearchedMovieSection();
  if (input.value !== '') {
    document.getElementById('wrongtitle').innerHTML = '';
    const getSearhedMovie = { movieinput: input.value };
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getSearhedMovie),
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response !== 'False') {
          renderSearchedMovie(data);
          input.value = '';
        } else {
          document.getElementById(
            'wrongtitle',
          ).innerHTML = `<h3>Hmm 🤔...something went wrong. ${data.Error}</h3>`;
        }
      })
      .catch((err) => errorText(err));
  } else {
    document.getElementById('wrongtitle').innerHTML = '<h3>Hmm 🤔...seems you did not enter any title. Try again.</h3>';
  }
});

const renderMoviesList = (movieData, renderList) => {
  for (let a = 0; a < 10; a += 1) {
    const Markup = `<li class="popular-card">
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

const removeFavoriteMovie = (key) => {
  const item = document.querySelector(`[data-key='${key}']`);
  favoriteMoviesArray.splice(favoriteMoviesArray.indexOf(item), 1);
  item.remove();
};

const renderMovie = (selectedMovie) => {
  const favoritesMarkup = `<li class="favorite-list" data-key="${selectedMovie.id}">
    <h4 class="favorite-title">${selectedMovie.title}</h4>
    <button class="favorite-remove">X</button>
    </li>`;

  list.insertAdjacentHTML('beforeend', favoritesMarkup);
};

const addFavoriteMovie = () => {
  movie = {
    title: document.getElementById('movie-title').innerHTML,
    id: Date.now(),
  };
  favoriteMoviesArray.push(movie);
  document.querySelector('#addbutton').remove();
  clearSearchedMovieSection();
  renderMovie(movie);
};

list.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  const itemKey = event.target.parentElement.dataset.key;
  removeFavoriteMovie(itemKey);
});
