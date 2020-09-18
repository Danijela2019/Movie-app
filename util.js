const fs = require('fs');

const fileOperation = (data) => {
  let favoritesListFile = [];

  fs.readFile('dbFavorites.json', 'utf8', (readFileErr, movieData) => {
    if (readFileErr) throw readFileErr;
    favoritesListFile = JSON.parse(movieData);
    favoritesListFile.favoritesList.push(data);
    const json = JSON.stringify(favoritesListFile, null, 2);

    fs.writeFile('dbFavorites.json', json, 'utf8', (writeFileErr) => {
      if (writeFileErr) throw writeFileErr;
      console.log('favoritesListFile saved successfully!');
    });
  });
  return favoritesListFile;
};
 
module.exports = fileOperation;
