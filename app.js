var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var _ = require('underscore');
var config = require('./lib/config');
var song_d = require('./lib/song.js');

var port = process.env.PORT || 5000;

request({
    url: webhook_url,
    json : true
}, (err, res, body) => {
   console.log(body); 
});

app.use(bodyParser.json());

app.listen(port, () =>
{
    console.log("Server is Started at - " + port);
});
