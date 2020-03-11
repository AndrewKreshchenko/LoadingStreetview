// https://pugjs.org/api/reference.html
const http = require('http');
var fs = require('fs');
var pug = require('pug');

const server = http.createServer((request, response) => {
  if (request.url == '/') {
    response.writeHeader(200, {"Content-Type": "text/html"});
    fs.readFile('./index_pug.html', 'utf-8', function(err, html) {
      if (err) throw err;
      let template = pug.compileFile('./view/index.pug');
      let html = template(pug_vals);
      response.write(html);
    });
    response.end();
  }

  if (request.url == '/api/courses') {
    response.write(JSON.stringify([1,2,3]));
    response.end();
  }
});
server.listen('8888');
console.log('Listening on port 8888...');