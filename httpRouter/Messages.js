'use strict';

const assert = require('assert');
var mongoose = require('mongoose');
const conversationModel = require('../model/conversation.js');
//mongoose.connect('mongodb://localhost/chat');
mongoose.Promise = require('bluebird');

class Messages {
    constructor(app) {
        this.app = app;
        this.promise = mongoose.connect('mongodb://localhost/chat', {
            useMongoClient: true
            /* other options */
        });
	this._getAllMsgForTours();
    }

    _getAllMsgForTours() {
        this.app.get('/TourMsg', (req, res) => {
            let queryData = {
                id: req.query.tourId,
            };
            // query chat history for this conversation
            conversationModel.findOne(queryData,
                function (err, conversation) {
                    if (conversation) {
                        res.send({ status: 'success', result: conversation });
                    }else{
		    	         res.send({status: 'success', result: {}});
		            }

            });            
            

        });
    }
}

module.exports = Messages;
