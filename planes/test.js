`use strict`


var socket = new WebSocket("ws://myserver.glorval.com/");

socket.send("Hello there");