const request = require('request');
const cheerio = require('cheerio');
var searchItem,searchUrl;
var count = 0;

function getMusic (songUrl,songName,callback) {
    request({
            url : songUrl,
            gzip : true
        }, (err, res, body)=> {
            if(err) throw err;
            else {
                var $ = cheerio.load(body);
                var allLinks = [];
                // console.log(songName);
                $("#dl > .d-info2 > dl >dd >a").each(function(){
                    allLinks.push($(this).attr('href'));
                });
                if(allLinks[allLinks.length - 1].search("keepvid.com") == 7 ) {
                    if(allLinks[allLinks.length - 2].search("keepvid.com") == 7 ) {
                        var musicUrl = allLinks[allLinks.length - 3];
                    } else {
                        var musicUrl = allLinks[allLinks.length - 2];
                    }
                   
                } else {
                    var musicUrl = allLinks[allLinks.length - 1];
                }
                // console.log(musicUrl);
               songName = songName.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*|\[|\]|\(|\)|\'/g,'').replace(/lyrics/g,'').replace(/Official Video/g,'');
               var songObj = {
                   name : songName,
                   url : musicUrl
               }
            }
            callback(songObj);
        });
}

function getDownloadUrl(searchUrl,callback){
    request({
        url : searchUrl,
        gzip : true
    }, (err, res, body) => {
        if(err) throw err;
        else {
            var videoUrls = [];
            var n = 0;
            var z = 0;
            var $ = cheerio.load(body);
            $(".yt-lockup-title > a").each(function(){
                var urlCurrent = {
                    url : $(this).attr('href'),
                    title : $(this).attr('title')
                }
                videoUrls.push(urlCurrent);
            });
            for(z=0;z<videoUrls.length;z++) {
                if(videoUrls[n].url.search("user")==1 || videoUrls[n].url.search("channel")==1 || videoUrls[n].url.search("googleads.g")==8) {
                    // console.log(n);
                    n = n + 1;
                    // console.log(n);
                } else {
                    break;
                }
            }
            var mainUrl = "http://keepvid.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" 
                            + videoUrls[n].url.replace("/watch?v=",'');
            var songTitle = videoUrls[n].title;
            getMusic(mainUrl,songTitle,callback);
        }
    });
}

module.exports = function(s_name,callback){
    var q_url = "https://www.youtube.com/results?search_query="+s_name.replace(/ /g, "+");
    getDownloadUrl(q_url,callback);
}