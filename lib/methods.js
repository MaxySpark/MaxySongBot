'use strict'
var google = require('googleapis');
const request = require('request');
const _ = require('underscore');
var config = require('./config')

var sendUrl = "https://graph.facebook.com/v2.6/me/messages";

function sendMsg(data) {
    console.log(JSON.stringify(data));
    var sendId = data.senderId;
    var msg = data.musicUrl;

    request({
        uri : "https://www.googleapis.com/urlshortener/v1/url",
        qs: {
            key : config.API_KEY
        },
        method : 'POST',
        json : {
            longUrl : msg
        }
    },(err,res,body) => {
        console.log(body.id);
        var songUrl = body.id;
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
                        "text": data.name,
                        "buttons":[
                        {
                            "type":"web_url",
                            "url": songUrl,
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

    });

}

module.exports = {
    sendMsg : sendMsg
}