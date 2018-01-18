'use strict';
var mongoose = require('mongoose');
const conversationModel = require('../model/conversation.js');
//mongoose.connect('mongodb://localhost/chat');
mongoose.Promise = require('bluebird');

class Notification{
    constructor(io, socket){
        this.io = io;
        this.socket = socket;
        
        this.promise = mongoose.connect('mongodb://localhost/chat', {
            useMongoClient: true
            /* other options */
        });
	this._notifyMsg();
    }

    _notifyMsg(){
        this.socket.on('message', function(msg){
            //console.log(msg);
        });

        this.socket.on('error', function(e){
            console.log(e);
        });

        this.socket.on('disconnect', function(e){
            //console.log('Some one disconnected');
        });

        this.socket.on('message.push', function(message){
	    //console.log(message)
            this.io.emit(message.toUser,message);
            this.io.emit(message.fromUser,message);
            this._saveMsg(message);
        }.bind(this));
    }


    _saveMsg(message) {
      conversationModel.findOne({
            id: message.tourId
        }, function (err, conversation) {
	    //console.log(err);
            if (!conversation) {
                conversation = new conversationModel({
                    id: message.tourId,
                    content: []
                });
            }

            conversation.content.push({
                toUser: message.toUser,
                toUserMobile: message.toUserMobile,
                toUserPic: message.toUserPic,
                fromUser: message.fromUser,
                fromUserMobile: message.fromUserMobile,
                fromUserPic: message.fromUserPic,
                priority:message.priority,
                message:message.message
            });

            conversation.save();
        });

    }
}

module.exports = Notification;
