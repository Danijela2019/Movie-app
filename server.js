const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const server = express();
const port = process.env.PORT || 4000;
require('dotenv').config();

server.use(express.static(`${__dirname}/public`));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

function promiceFetchMovies(response) {
  const apikey2 = process.env.API_KEYS;
  const popularMoviesUrl = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apikey2}&language=en-US&page=1`);
  const upcomingMoviesUrl = fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey2}&language=en-US&page=1`);
  Promise.all([popularMoviesUrl, upcomingMoviesUrl])
    .then((res) => Promise.all(res.map((responseApi) => responseApi.json())))
    .then((finaldata) => {
      const popular = finaldata[0];
      const upcoming = finaldata[1];
      response.json({ popular, upcoming });
    })
    .catch((error) => console.log(error));
}
server.get('/api/movies', (_req, res) => {
  promiceFetchMovies(res);
});

function promiceFetchMovie(inputVal, response) {
  const apikey = process.env.API_KEY;
  const url = `http://www.omdbapi.com/?apikey=${apikey}&t=${inputVal}`;
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res;
    })
    .then((res) => res.json())
    .then((data) => response.json(data))
    .catch((error) => console.log(error));
}
server.post('/api', (req, res) => {
  const inputVal = req.body.movieinput;
  promiceFetchMovie(inputVal, res);
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
