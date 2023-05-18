const fs = require('fs');
const request = require('request');
const readline = require('readline');

const url = process.argv[2];
const filePath = process.argv[3];


if (fs.existsSync(filePath)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('The file already exists. Do you want to overwrite it? (Y/N) ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('File not overwritten. Exiting...');
      rl.close();
      return;
    }

    rl.close();
    downloadFile(url, filePath);
  });
} else {
  downloadFile(url, filePath);
}

function downloadFile(url, filePath) {
  request(url, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      return;
    }

    if (response.statusCode !== 200) {
      console.error('Invalid URL. Status code:', response.statusCode);
      return;
    }

    fs.writeFile(filePath, body, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }

      const fileSize = Buffer.byteLength(body);
      console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
    });
  });
}