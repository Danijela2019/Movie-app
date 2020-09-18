const fsPromises = require('fs').promises;

const fileRead = async () => {
  const filePromise = await fsPromises.readFile('dbFavorites.json', 'utf8', (err) => {
    if (err) throw err;
  });
  return filePromise;
};

const fileOperations = async (data) => {
  const file = await fileRead();
  const parsedFile = JSON.parse(file);
  parsedFile.favoritesList.push(data);
  const json = JSON.stringify(parsedFile, null, 2);

  await fsPromises.writeFile('dbFavorites.json', json, 'utf8', (err) => {
    if (err) throw err;
  });
  console.log('This is the file', parsedFile);
  return parsedFile;
};

module.exports = fileOperations;
