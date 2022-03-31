const static = require('node-static');
//const { exec } = require('child_process');
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('.');

require('http').createServer(function (request, response) {
    
    request.addListener('end', function () {
        // response.setHeader('Access-Control-Allow-Origin', '*');
        file.serve(request, response);
    }).resume();
}).listen(3000);
console.log("Listening on http://localhost:3000");