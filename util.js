const fsPromises = require('fs').promises;

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
  parsedFile.favoritesList.push(data);
  const json = JSON.stringify(parsedFile, null, 2);
  await fsPromises.writeFile('dbFavorites.json', json, 'utf8', (err) => {
    if (err) throw err;
  });
  return parsedFile;
};

module.exports.fileOperations = fileOperations;
module.exports.fileRead = fileRead;
