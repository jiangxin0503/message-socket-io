var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    id: String,
    content: [{
    	toUser: String,
        toUserMobile: String,
        toUserPic: String,
        fromUser: String,
        fromUserMobile: String,
        fromUserPic: String,
        priority: String,
    	message: String,
        when: {
            type: Date,
            default: Date.now
        }
    }]
});


var conversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = conversationModel;