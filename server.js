var express = require("express");
var app = express();
var server = app.listen(3000);

var anzahlClients=0;
var erforderteClients = 2;

app.use(express.static('public'));


var farben = [
    "#611949", // violet
    "#e74431", // rot
    "#009E73", // gruen
    "#F0E442", // gelb
    "#0072B2", // blau
];

var usedFarben=[];

console.log("my server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log("new connection");
    console.log(socket.id);

    let farbe = neueFarbe();
    let counter=0;

    while( usedFarben.indexOf(farbe) > -1  && counter < 100){
        farbe = neueFarbe();
        counter++;
    }

    anzahlClients++;

    usedFarben.push(farbe);

    let settings={
        id:anzahlClients,
        socketid:socket.id,
        farbe:farbe,
        start:0,
        timer:0
    };

    io.to(socket.id).emit("farbe", settings);// geht nur an client der sich angemeldet hat

    //console.log(anzahlClients);

    socket.on('canIStart', MsgStart);

    function MsgStart(data){
        //console.log("activeScreen"+activeScreen);
        //console.log("client"+data.socketid);

        if(anzahlClients == erforderteClients){
            data.start=1;
            io.to(data.socketid).emit('startTimer', data);
            //console.log("go");
        }

        //io.sockets.emit('start', settings);
        // io.to(`${socketId}`).emit('settings', offsetWidth);
        // socket.broadcast.emit('mouse', data); //msg geht nicht an den client der gesendet hat
        //io.sockets.emit('mouse', data); //msg geht an alle clients
        //console.log(settings);
    }
}

function neueFarbe(){
    let wuerfel = Math.floor(Math.random() * farben.length);//wuerfelt zahlen zwischen 0 und 4 (inklusive 4)
    let clientfarbe = farben[wuerfel];
    return clientfarbe;
}