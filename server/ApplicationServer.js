'use strict';

const express = require('express');
const http = require('http');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');
const AppConfig = require('../config/AppConfig');
const AlertNotify = require('../socket/AlertNotify');
const Messages = require('../httpRouter/Messages');
const Notification = require('../socket/Notification');


class HttpServer{
    constructor(){
        this.app = express();
        if(AppConfig.HTTPS) {
            const privateKey = fs.readFileSync(path.join(__dirname,'../certificate/private.pem'),'utf8');
            const certificate = fs.readFileSync(path.join(__dirname,'../certificate/file.crt'),'utf8');
            const credentials = {
                key: privateKey,
                cert: certificate
            };
            this.httpsServer = https.createServer(credentials,this.app); 
            this.port = AppConfig.HTTPS_PORT;        
        }else{
            this.httpServer = http.createServer(this.app);
            this.port = AppConfig.HTTP_PORT
        }
        
        this._startHttpServer();
        this._startWebSocketServer();
        this._distributeMessage();
    }

    _startHttpServer(){
        if(AppConfig.HTTPS){
           this.httpsServer.listen(this.port); 
        }else{
            this.httpServer.listen(this.port);
        }
        this.app.use(express.static('./public'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        //this.app.use(express.static(__dirname.replace(/server\\core/, 'app')));
        this._addHttpRouter();
        console.log('HTTP listening: 127.0.0.1:' + this.port);
    }

    _startWebSocketServer(){
        if(AppConfig.HTTPS){
           this.io = socket.listen(this.httpsServer); 
        }else{
           this.io = socket.listen(this.httpServer); 
        }
        console.log('websocket listening: 127.0.0.1:' + this.port);
        this._startWebSocketconnect();
    }


    _distributeMessage() {
        new AlertNotify(this.app,this.io);
    }

    _addHttpRouter(){
        new Messages(this.app);
    }



    _startWebSocketconnect(){
        this.io.on('connection', (socket) => {
            this._addSocketListener(this.io, socket);
        });
    }

    _addSocketListener(io, socket){
        new Notification(io, socket);
    }

}

module.exports = HttpServer;
