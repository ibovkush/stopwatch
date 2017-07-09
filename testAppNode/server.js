'use strict';
var http = require('http');

var fs = require('fs');
var port = process.env.PORT || 1337;
var path = require('path');
var url = require('url');


http.createServer(function (request, response) {
    var parsed = url.parse(request.url);
    var url_local = parsed.pathname;

    url_local = url_local === "/" ? "/index.html" : url_local;

    url_local = "./wwwroot" + url_local;
    
    var ext = path.extname(url_local);
    
    fs.readFile(url_local, function (err, html) {
        if (err) {
            response.writeHeader(404, { "Content-Type": "text/html" });
            response.end();
            return;
        }

        var contentType;
        switch (ext) {
            case ".css":
                contentType = "text/css";
                break;
            case ".ico":
                contentType = "webimage";
                break;
            case ".js":
                contentType = "text/javascript";
                break;
            default:
                contentType = "text/html";
        }


        response.writeHeader(200, { "Content-Type": contentType });
        response.write(html);
        response.end();
    });
}).listen(port);



