const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'),
  {withFileTypes: true},
  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.stat(path.join(__dirname, `secret-folder/${file.name}`), (err, {size}) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`${file.name.replace('.', ' - ')} - ${(size / 1024).toFixed(3)}kb`);
            }
          });
        }
      });
    }
  });