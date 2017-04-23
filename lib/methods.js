'use strict'

const request = require('request');
const _ = require('underscore');
var config = require('./config')

var sendUrl = "https://graph.facebook.com/v2.6/me/messages";

function sendMsg(data) {
    console.log(JSON.stringify(data));
    var sendId = data.senderId;
    var msg = data.musicUrl;
    request({
        uri : sendUrl,
        qs : { access_token : config.page_token },
        method : 'POST',
        json : {
            "recipient":{
  	            "id":sendId
            },
            "message":{
                "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":"Click Here To Download The Song - " + data.name,
                    "buttons":[
                    {
                        "type":"web_url",
                        "url": "https://goo.gl/OBLMUC",
                        "title":"DOWNLOAD"
                    }]
                }
                }
            }
        }
    }, (err,res,body) => {
        if(err) throw err;
        console.log("msg sent %d",sendId);
    });
}

module.exports = {
    sendMsg : sendMsg
}