'use strict';

const assert = require('assert');

class AlertNotify {

    constructor(app, io){
        this.app = app;
        this.io = io;
        this._pushAlertMsg();
    }

    _pushAlertMsg() {
        this.app.post('/pushAlertMsg',(req, res) => {
           
            /*let tourId = req.body.tourId;
            let msg = req.body.msg;
            let priority = req.body.priority;
            let alerMsg = {
                tourId:   tourId,
                message:  msg,
                priority: priority
            };*/

	    let alertMsg = req.body;
	    //console.log(alertMsg);
	    if(alertMsg) {
	    	 this.io.emit("message.alert",alertMsg);
		 res.send({
			status: 'success'
		 });
	    }else {
	         res.send({
			status: 'error',
			error: 'No message recieved'
		 });
		
	    }
        });
    }
}

module.exports = AlertNotify;
