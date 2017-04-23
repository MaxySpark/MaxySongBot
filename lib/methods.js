'use strict'
var google = require('googleapis');
const request = require('request');
const _ = require('underscore');
var config = require('./config')

var sendUrl = "https://graph.facebook.com/v2.6/me/messages";

function sendMsg(data) {
    console.log(JSON.stringify(data));
    var sendId = data.senderId;
    var sendName = data.name;
    var msgLongLink = data.musicUrl;

    urlShort(msgLongLink,send);

}

function urlShort(url,callback){
    request({
        uri : "https://www.googleapis.com/urlshortener/v1/url",
        qs: {
            key : config.API_KEY
        },
        method : 'POST',
        json : {
            longUrl : url
        }
    },(err,res,body) => {
        callback(sendId,sendName,body.id);
    });
}

function send(sendId,sendName,msgShortLink) {
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
                        "text": sendName,
                        "buttons":[
                        {
                            "type":"web_url",
                            "url": msgShortLink,
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