'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });






wss.on('connection', function(ws) {

    ws.on('message', function(message) {
        message = JSON.parse(message);
        console.log(message);
        if(message.type == 'name'){
            ws.personName = message.data;
            return;
        }
        console.log('Recieved:' +message); 
        
        wss.clients.forEach(function e(client){
            if(client != ws)
            client.send(JSON.stringify({
                name:ws.personName,
                data:message.data
            }));
        })
        
        //ws.send('From Server: '+message);touc
        

    });
    ws.on('close', function() {
        console.log("I lost a Client");

    });
    console.log("One more client connected");
});
