var server = require('websocket').server,
    http = require('http');

var socket = new server({
    // httpServer: http.createServer().listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0")
    httpServer: http.createServer().listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0")
});

//var firebase = require('firebase');
//
//firebase.initializeApp({
//    databaseURL: 'https://myfirstmapboxapp-11599.firebaseio.com/',
//    serviceAccount: 'myfirstmapboxapp-11599-firebase-adminsdk-d59y1-753eb58bf3.json', //this is file that I downloaded from Firebase Console
//});

var admin = require("firebase-admin");

var serviceAccount = require("./myfirstmapboxapp-11599-firebase-adminsdk-d59y1-753eb58bf3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myfirstmapboxapp-11599.firebaseio.com"
});

socket.on('request', function (request) {

    var connection = request.accept(null, request.origin);

    connection.on('message', function (message) {

        // logs the message that was received from the client
        // in this case you want to capture the message and send it to Firebase
        console.log(message.utf8Data);
        
        admin.database().ref('/GeoFire/Jedi One/l').update(JSON.parse(message.utf8Data));
        

        var seconds = new Date().getTime() / 1000

        //sends message from server to the client
        connection.sendUTF('hello from the server - ' + seconds);

        //sets a timer before sending the message - this waits 20seconds - one time wait event
        setTimeout(function () {
            connection.sendUTF('This message waited 20 seconds before it started to send');
        }, 20000);

    });

    connection.on('close', function (connection) {
        console.log('connection closed');
    });
});