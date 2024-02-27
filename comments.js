// Create web server 
// 1. Create a web server
// 2. Listen to the port
// 3. Create a response
// 4. Send the response
// 5. Close the response
// 6. Close the server
// 7. Run the server

var http = require('http');
var fs = require('fs');
var url = require('url');

var server = http.createServer();
server.listen(3000);

server.on('request', function(request, response){
	var url_parts = url.parse(request.url);
	var path = url_parts.pathname;
	var method = request.method;

	if(path == '/'){
		fs.readFile('index.html', function(err, data){
			response.write(data);
			response.end();
		});
	} else if(path == '/comments' && method == 'POST'){
		var body = '';
		request.on('data', function(data){
			body += data;
		});
		request.on('end', function(){
			var comment = JSON.parse(body);
			fs.readFile('comments.json', function(err, data){
				var comments = JSON.parse(data);
				comments.push(comment);
				fs.writeFile('comments.json', JSON.stringify(comments), function(err){
					response.writeHead(200, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(comments));
					response.end();
				});
			});
		});
	} else {
		fs.readFile(path.substring(1), function(err, data){
			response.write(data);
			response.end();
		});
	}
});

server.on('close', function(){
	console.log('Server closed');
});