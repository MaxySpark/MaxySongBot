'use strict'

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('underscore');
const app = express();
var config = require('./lib/config');
var methods = require('./lib/methods');
var sendMsg = methods.sendMsg; 

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
    var msgData = data.entry[0].messaging;

    if(data.object == "page") {
        sendMsg(msgData);
    }

    res.send(200);
});

app.listen(port, () =>
{
    console.log("Server is Started at - " + port);
});