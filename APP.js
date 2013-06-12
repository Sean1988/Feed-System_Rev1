//Create Server
var http = require("http");
var url = require('url');
var fs = require('fs');

//Initialize Redis
var _redis = require('redis');
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
});
 
server.listen(8080); 

//Initialize  socket.io
var io = require('socket.io').listen(server);
io.set('log level', 1);

var data;
var user;

//Send message to client
io.sockets.on('connection', function(socket){
           //console.log('check:'+data);
           redis.subscribe("abc");
           redis.on("message",function(channel,message){
                data=message;
                socket.emit('msg',{'msg':data});
                console.log("client channel recieve from channel : %s, the message : %s", channel, message);
            });

           var redis2=_redis.createClient();
           socket.on('client_data',function(data){
                console.log("user id:"+data.letter);
                redis2.sadd("LiveUser",data.letter);
           });
});


