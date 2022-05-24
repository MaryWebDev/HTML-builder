const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
  if (err) throw err;
});

fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, template) => {
  if (err) {
    console.error(err);
    return;
  }
  fs.readdir(path.join(__dirname, 'components'),
    (err, files) => {
      if (err)
        console.log(err);
      else {
        let promises = [];
        let fileNames = [];

        for (const file of files) {
          promises.push(fs.promises.readFile(path.join(__dirname, `/components/${file}`)));
          fileNames.push(file);
        }
        Promise.all(promises).then(files => {
          files.forEach((file, i) => template = template.replace(`{{${fileNames[i].split('.')[0]}}}`, file.toString()));
        }).then(() => {
          fs.writeFile(path.join(__dirname, 'project-dist/index.html'), `${template}`, (err) => {
            if (err) console.log(err);
            console.log('index.html was created');
          });
        });
      }
    });
});


async function getData(dirPath = path.join(__dirname, 'styles')) {
  fs.readdir(path.join(__dirname, 'project-dist'), (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.toString() === 'bundle.css') {
        fs.unlink(path.join(__dirname, 'project-dist/style.css'), err => {
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
          fs.promises.writeFile(path.join(__dirname, '/project-dist/style.css'), `${data}\n`, {flag: 'a'});
        });
      }
    }
  });
}

getData().then(() => console.log('style.css was created')).catch(err => console.log(err));


function copyDir(folder, dirPath = path.join(__dirname, 'assets')) {
  fs.promises.mkdir(path.join(__dirname, `project-dist/assets/${folder}`), {recursive: true}).then(() => {
    fs.readdir(path.join(__dirname, `project-dist/assets/${folder}`), (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(`${path.join(__dirname, `project-dist/assets/${folder}`)}/${file}`, err => {
          if (err) throw err;
        });
      }
    });
  }).then(() => {
    fs.readdir(`${dirPath}/${folder}`, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.copyFile(`${dirPath}/${folder}/${file}`, `${path.join(__dirname, 'project-dist/assets')}/${folder}/${file}`, (err) => {
          if (err) throw err;
        });
      }
    });
  })
    .catch((err) => {
      console.log(err);
    });
}


fs.promises.mkdir(path.join(__dirname, 'project-dist/assets/'), {recursive: true}).then(() => {
  fs.readdir(path.join(__dirname, 'assets'), (err, dirs) => {
    if (err) throw err;
    for (const dir of dirs) {
      copyDir(dir.toString());
      console.log(`${dir} was copied`);
    }
  });
});

