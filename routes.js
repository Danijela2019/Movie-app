const express = require('express');
const utilities = require('./util_server');
const router = express.Router();

router.get('/api/movies', utilities.asyncHandler((_req, res) => {
    utilities.promiseFetchMovies(res);
  }));
  router.get('/api/about', utilities.asyncHandler((_req, res) => {
    res.status(200).sendFile(`${__dirname}/pages/about.html`);
  }));
  router.get('/api/login', utilities.asyncHandler((_req, res) => {
    res.status(200).sendFile(`${__dirname}/pages/login.html`);
  }));
  router.get('/data', utilities.asyncHandler(async (_req, res) => {
    res.status(200).json(await utilities.fileRead());
  }));
  router.post('/api', utilities.asyncHandler((req, res) => {
    const inputVal = req.body.movieinput;
    utilities.promiseFetchAMovie(inputVal, res);
  }));
  router.post('/data', utilities.asyncHandler((req, res) => {
    const movie = req.body;
    res.status(201).json(utilities.fileOperations(movie));
  }));
  router.get('*', (_req, res) => {
    res.status(404).sendFile(`${__dirname}/pages/NotFound.html`);
  });

  module.exports = router;