const path = require('path');
const fs = require('fs');


async function getData(dirPath = path.join(__dirname, 'styles')) {
  fs.readdir(path.join(__dirname, 'project-dist'), (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.toString() === 'bundle.css') {
        fs.unlink(path.join(__dirname, 'project-dist/bundle.css'), err => {
          if (err) throw err;
        });
      }
    }
  });

  fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.isFile() && path.extname(`${file.name}`) === '.css') {
        fs.readFile(`${dirPath}/${file.name}`, 'utf8', (err, data) => {
          fs.promises.writeFile(path.join(__dirname, '/project-dist/bundle.css'), `${data}\n`, {flag: 'a'});
        });
      }
    }
  });
}

getData().catch(err => console.log(err));

