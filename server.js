const express = require('express');
const bodyParser = require('body-parser');
const fileOperations = require('./util_server');

const server = express();
const port = process.env.PORT || 4000;

server.use(express.static(`${__dirname}/public`));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/api/movies', (_req, res) => {
  fileOperations.promiseFetchMovies(res);
});
server.get('/api/about', (_req, res) => {
  res.sendFile(`${__dirname}/pages/about.html`);
});
server.get('/api/login', (_req, res) => {
  res.sendFile(`${__dirname}/pages/login.html`);
});

server.post('/api', (req, res) => {
  const inputVal = req.body.movieinput;
  fileOperations.promiseFetchAMovie(inputVal, res);
});

server.post('/data', async (req, res) => {
  const movie = req.body;
  res.json(await fileOperations.fileOperations(movie));
});
server.get('/data', async (_req, res) => {
  res.json(await fileOperations.fileRead());
});

server.get('*', (_req, res) => {
  res.status(404).sendFile(`${__dirname}/pages/NotFound.html`);
});
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
