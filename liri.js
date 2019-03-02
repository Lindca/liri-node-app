
var axios = require("axios");
var app = process.argv;
var keyword=process.argv.slice(3).join(" ");
var keywordEncoded = encodeURI(keyword);
var moment = require('moment');
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

if (app[2] === "spotify-this-song") {
    searchSpotify(keywordEncoded);
}
else if (app[2] === "concert-this") {
    searchConcert(keywordEncoded);
}
else if (app[2] === "movie-this") {
    searchMovies(keywordEncoded);
}
else if (app[2] === "do-what-it-says") {
    readLog();
}
else {
    console.log("Please try again!");
    console.log("You may have entered something incorrect or nothing at all!")
}

function readLog() {
    fs.readFile('random.txt', "utf8", function (err, data) {
        if (err) {
            console.error(err);
        }
        else {
            var dataArray = data.split(",");
            if (dataArray[0] === 'spotify-this-song') {
                searchSpotify(dataArray[1])
            }
        }

    })
}
function searchConcert(keywordEncoded) {
    axios.get("https://rest.bandsintown.com/artists/" + keywordEncoded + "/events?app_id=codingbootcamp").then(
        function (response) {
            var venues = response.data;
            // console.log(response.data);
            for (var i = 0; i < venues.length; i++) {
                console.log("Venue Name: " + venues[i].venue.name);
                console.log("Location: " + venues[i].venue.city);
                console.log("Event Date: " + moment(venues[i].datetime).format("MM/DD/YYYY"));
            }
        }
    );
}
function searchMovies(keywordEncoded = "Mr. Nobody") {
    axios.get("http://www.omdbapi.com/?t=" + keywordEncoded + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            var movie = response.data;
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMBD Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Country Produced: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        }
    );
}
function searchSpotify(keywordEncoded = "The Sign") {
    spotify.search({ type: 'track', query: keywordEncoded }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                var songs = data.tracks.items;
                var artist = "Artist: " + songs[i].artists[0].name
                var songName = "Song Name: " + songs[i].name;
                var songPreview = "Song Preview: " + songs[i].external_urls.spotify;
                var songAlbum = "Album: " + songs[i].album.name;
                console.log(artist);
                console.log(songName);
                console.log(songPreview);
                console.log(songAlbum);

            }
            // var combo = '\n' + artist + '\n' + songName + '\n' + songPreview + '\n' + songAlbum;
            // fs.appendFile('log.txt', combo, function () {

            // })
        }
    })

}