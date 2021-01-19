const fsPromises = require('fs').promises;
const fetch = require('node-fetch');
require('dotenv').config();

const promiseFetchMovies = (response) => {
  const apikey2 = process.env.API_KEYS;
  const popularMoviesUrl = fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apikey2}&language=en-US&page=1`,
  );
  const upcomingMoviesUrl = fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey2}&language=en-US&page=1`,
  );
  Promise.all([popularMoviesUrl, upcomingMoviesUrl])
    .then((res) => Promise.all(res.map((responseApi) => responseApi.json())))
    .then((finaldata) => {
      const popular = finaldata[0];
      const upcoming = finaldata[1];
      response.status(200).json({ popular, upcoming });
    })
    .catch((error) => console.log(error));
};

const promiseFetchAMovie = (inputVal, response) => {
  const apikey = process.env.API_KEY;
  const url = `http://www.omdbapi.com/?apikey=${apikey}&t=${inputVal}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => response.status(200).json(data))
    .catch((error) => console.log(error));
};

const fileRead = async () => {
  const filePromise = await fsPromises.readFile(
    'dbFavorites.json',
    'utf8',
    (err) => {
      if (err) throw err;
    },
  );
  const parsedFile = JSON.parse(filePromise);
  return parsedFile;
};

const fileOperations = async (data) => {
  const parsedFile = await fileRead();
  if (data.title) {
    parsedFile.favoritesList.push(data);
  } else {
    const toRemoveMovieId = parseInt(data.id, 10);
    const updatedArray = parsedFile.favoritesList.filter((item) => item.id !== toRemoveMovieId);
    parsedFile.favoritesList = [...updatedArray];
  }
  const json = JSON.stringify(parsedFile, null, 2);
  await fsPromises.writeFile('dbFavorites.json', json, 'utf8', (err) => {
    if (err) throw err;
  });
  return parsedFile;
};

const asyncHandler = (cb) => async (req, res, next) => {
  try {
    await cb(req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fileOperations,
  fileRead,
  promiseFetchAMovie,
  promiseFetchMovies,
  asyncHandler
}
