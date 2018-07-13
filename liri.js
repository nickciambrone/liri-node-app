require("dotenv").config();
var keys = require("./keys.js")
var request = require('request');
var Twitter = require('twitter');
var fs = require("fs");
var Spotify = require('node-spotify-api');


var command = process.argv[2];
var keyWords = process.argv.slice(3)

var tweets = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});
var params = { screen_name: 'CiambroneNick' };
tweets.get('statuses/user_timeline', params, function (error, tweets, response) {
  if (command == "my-tweets")
    for (var key in tweets) {
      console.log("\n" + tweets[key].text);
      console.log(tweets[key].created_at);
    }
});
function spotifyThis() {

  // Setting up spotify package as per docs
  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });


  
  if (keyWords == "") {
    keyWords = "The Sign Ace of Base"
  }

  spotify.search({ type: 'track', query: keyWords, limit: 1 }, function (err, data) {

    // Another format to console out the error if one occurs
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    // consoling out the requested data

    console.log("\n");
    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
    console.log("Song's name: " + data.tracks.items[0].name);
    console.log("Preview link: " + data.tracks.items[0].preview_url);
    console.log("Album name: " + data.tracks.items[0].album.name)
  });

}
function movieThis() {

  var queryURL = "http://www.omdbapi.com/?t=" + keyWords + "&apikey=trilogy"

  request(queryURL, function (error, response, body) {
    if (error) {
      console.log(error)
    }
    else {
      var newBody = JSON.parse(body)
      console.log("Title: "+newBody.Title)
      console.log("Year: "+newBody.Year)
      console.log("IMDB Rating: "+newBody.imdbRating)
      console.log("Rotten Tomatoes Rating: "+newBody.Ratings[1].Value)
      console.log("Country: "+newBody.Country)
      console.log("Language(s): "+newBody.Language)
      console.log("Plot: "+newBody.Plot)
      console.log("Actors: "+newBody.Actors)
    }
  });
}
function doWhatItSays(){
  fs.readFile("random.txt","utf8", function(error, data){
    if (error){
      return console.log(error);
    }
    var dataArr = data.split(",")
    command=dataArr[0]
    keyWords = dataArr.slice(1)
    
if (command == "spotify-this-song") {
  spotifyThis()
}
if (command == "movie-this") {
  movieThis()
}
if (command == "do-what-it-says"){
  doWhatItSays()
}
  })
}



if (command == "spotify-this-song") {
  spotifyThis()
}
if (command == "movie-this") {
  movieThis()
}
if (command == "do-what-it-says"){
  doWhatItSays()
}