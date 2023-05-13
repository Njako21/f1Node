const http = require('http');
const https = require('https');

function request(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(`Failed to load page, status code: ${res.statusCode}`);
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const html = chunks.join('');

        resolve(html);
      });
    }).on('error', (error) => {
      reject(`Failed to load page: ${error.message}`);
    });
  });
}

module.exports = {
    request
};