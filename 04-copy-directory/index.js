const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

function copyDir(dirPath = path.join(__dirname, 'files')) {
  fsPromises.mkdir(`${dirPath}-copy`, {recursive: true}).then(() => {
    fs.readdir(`${dirPath}-copy`, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(`${dirPath}-copy/${file}`, err => {
          if (err) throw err;
        });
      }
    });
  }).then(() => {
    fs.readdir(dirPath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.copyFile(`${dirPath}/${file}`, `${dirPath}-copy/${file}`, (err) => {
          if (err) throw err;
          console.log(`${file} was copied`);
        });
      }
    });
  })
    .catch((err) => {
      console.log(err);
    });
}

copyDir();