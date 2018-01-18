
'use strict';
const ApplicationServer = require('./Server/ApplicationServer');

class Server{
    constructor(){
        this._startSystem();
    }

    _startSystem(){
        new ApplicationServer();
    }
}

new Server();
