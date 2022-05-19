const path = require('path');
const fs = require('fs/promises');
const events = require('events');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const items = ['color', 'name', 'food', 'city', 'movie', 'singer'];

fs.writeFile(path.join(__dirname, 'text.txt'), '', {flag: 'a'})
  .then(() => {
    (async function waitForAns() {
      let item = items[Math.floor(Math.random() * items.length)];
      try {
        readline.question(`What's your favourite ${item}?\n`, item => {
          if (item === 'exit') {
            readline.close();
          } else {
            fs.writeFile(path.join(__dirname, 'text.txt'), `${item}\n`, {flag: 'a'});
            waitForAns();
          }
        });

        await events.once(readline, 'close');
      } catch (err) {
        console.log(err);
      }
    })().then(() => console.log('Good Bye'));
  });
