const express = require('express');
const utilities = require('./util_server');
const router = express.Router();

router.get('/api/movies', utilities.asyncHandler((_req, res) => {
    utilities.promiseFetchMovies(res);
  }));
  router.get('/api/about', utilities.asyncHandler((_req, res) => {
    res.sendFile(`${__dirname}/pages/about.html`);
  }));
  router.get('/api/login', utilities.asyncHandler((_req, res) => {
    res.sendFile(`${__dirname}/pages/login.html`);
  }));
  router.get('/data', utilities.asyncHandler(async (_req, res) => {
    res.json(await utilities.fileRead());
  }));
  router.post('/api', utilities.asyncHandler((req, res) => {
    const inputVal = req.body.movieinput;
    utilities.promiseFetchAMovie(inputVal, res);
  }));
  router.post('/data', utilities.asyncHandler((req, res) => {
    const movie = req.body;
    res.json(utilities.fileOperations(movie));
  }));
  router.get('*', (_req, res) => {
    res.status(404).sendFile(`${__dirname}/pages/NotFound.html`);
  });

  module.exports = router;