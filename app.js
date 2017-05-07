'use strict'

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('underscore');
const app = express();
var config = require('./lib/config');
var methods = require('./lib/methods');
var song_d = require('./lib/song.js');
var sendMsg = methods.sendMsg; 
var sendMsgBlank = methods.sendMsgBlank;
var port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/',function(req,res) {
    res.send("running").status(200);
});

//validation

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.varify_token) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});


app.post('/webhook',function(req,res) {
    
    var data = req.body;
    if(data.object == "page") {
        var msgData = data.entry[0].messaging;
        msgData.forEach(function(event) {     
            if (event.hasOwnProperty('delivery')) {
                console.log("delivery poop limited!!!");
            } else {
                if(event.message.text) {
                    song_d(event.message.text,event.sender.id,sendMsg);
                } else {
                    sendMsgBlank(event.sender.id);
                }
            }
        });
    }   

    res.send(200);
});

app.listen(port, () =>
{
    console.log("Server is Started at - " + port);
});