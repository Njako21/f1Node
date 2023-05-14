const http = require('http');
const https = require('https');


// This is a function that returns a Promise object for asynchronously loading a web page at a given URL.
// The function determines the protocol (http or https) of the URL, sends an HTTP request using that protocol, and then resolves the Promise with the HTML code of the page if the request is successful.
// If the request fails or if the response status code is outside the 200-299 range, the Promise is rejected with an error message.
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