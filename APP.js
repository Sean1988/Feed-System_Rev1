//Create Server
var http = require("http");
var url = require('url');
var fs = require('fs');

//Initialize Redis
var _redis = require("redis");
var redis = _redis.createClient();
 
 //Create Server
var server = http.createServer(function(request, response){
    console.log('Connection');
    var path = url.parse(request.url).pathname;
    //console.log(path);

    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;
        case '/socket.html':
            fs.readFile(__dirname+path, "utf-8",function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
    //response.end();
});
 
server.listen(8001); 

server.listen(8001); 

var data;

//Read in data from Redis
redis.smembers('name', function(error, result) {
    if (error) console.log('Error: '+ error);
    else{
      data=result;
      console.log('Name: ' + data);
    }
});

var io = require('socket.io').listen(server);

io.set('log level', 1);
 
io.sockets.on('connection', function(socket){
            //Broad cast the message
            for (var i = 0; i < data.length; i++) {
                socket.emit('msg',{'msg':data[i]});
                console.log(data[i]);
            };
});

