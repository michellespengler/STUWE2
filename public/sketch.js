/*
Deploy to heroku
 */
var socket;
var bcColor="#000000";
var timer=0;
var timeDifference=0;

var settings={
    start:0,
    tap: 0,
    farbe:"#000000",
    socketid:0,
    id:0,
    timer:0
};

function setup() {
    createCanvas(700, 700);
    socket=io.connect("http://localhost:3000/"); //anmeldung
    //socket=io.connect("/");
    //socket=io.connect("http://10.147.112.253:3000/");
    //socket.on('mouse', newDrawing);
    socket.on('farbe', newBgColor);
    socket.on('startTimer', startTimer);
    background(255);
}

function newBgColor(data){
    settings = data;
    bcColor=data.farbe;
}

function draw() {
    if(settings.start == 0 ){
        socket.emit('canIStart', settings);
    }

    background(bcColor);
    textSize(48);

    //text("Ich bin Client Nummer " + settings.id);
    if(settings.start == 1){
        let millis = Date.now() - settings.timer;
        text("Timer"+ msToTime(millis) + "s", 50,50)
    }

}

function startTimer(data){
    //console.log('start');

    settings.start = 1;
    settings.timer = Date.now();
}
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function mouseDragged(){
    if(settings.start == 1) {
        console.log ("probe");
       settings.tap = 1; 

    }
    /* console.log(mouseX, mouseY);
    fill(0);
    var data={
        x:mouseX,
        y:mouseY
    }
// sendefunktion
    socket. emit('mouse', data);
    ellipse(mouseX, mouseY, 10, 10); */
}
