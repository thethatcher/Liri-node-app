var inquire = require("inquirer");
var fs = require("fs");
var twitter = require("twitter");
var keys = require('./keys.js');
var spotify = require('node-spotify-api');
var request = require("request");
var client = new twitter({
	consumer_key: keys.twitterKeys.consumer_key
	,consumer_secret: keys.twitterKeys.consumer_secret
	,access_token_key: keys.twitterKeys.access_token_key
	,access_token_secret: keys.twitterKeys.access_token_secret
});
var spotifyClient = new spotify({
	 id: keys.spotifyKeys.id
	,secret: keys.spotifyKeys.secret
}); 
console.log(keys.omdbKey);

run();

function myTweets(){
	client.get("statuses/user_timeline",{screen_name:"bootcamptrash"}, function(error, tweets, response){
		if(error){console.log(error);}
		else{
			for (var i = 0; i < 20; i++) {
				if(i < tweets.length){
					console.log(tweets[i].created_at);
					console.log(tweets[i].text + "\n-------------------");
				}
			}
		}
		run();
	});
	
}

function spotifyThisSong(song){
	spotifyClient.search({ type:"track", query: song, limit:"1"},function(err, data){
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Album: " + data.tracks.items[0].album.name);
		console.log("Song: " + data.tracks.items[0].name);
		console.log("Preview: " + data.tracks.items[0].preview_url);
		run();
	})
}

function movieThis(movie){
	var url = "http://www.omdbapi.com/?t=" + movie + "&apikey=" + keys.omdbKey
	request(url,function(error,response,body){
		if(error){console.log(error);}
		else if(response.statusCode === 200){
			var data = JSON.parse(body);
			console.log("Movie: " + data.Title);
			console.log("Released: " + data.Year);
			console.log("IMDB Rating: " + data.Ratings[0].Value);
			console.log("Rotton Tomatoes Rating: " + data.Ratings[1].Value);
			console.log("Produced in: " + data.Country);
			console.log("Language: " + data.Language);
			console.log("Plot: " + data.Plot);
			console.log("Actors: " + data.Actors);
		}
		run();
	});
}

function doWhatItSays(){
	fs.readFile("../random.txt","utf8",function(error,data){
		
		var temp = data.split(",");
		if(temp[0] === "my-tweets"){myTweets();}
		else if(temp[0] === "spotify-this-song"){spotifyThisSong(temp[1]);}
		else if(temp[0] === "movie-this"){movieThis(temp[1]);}
		else{console.log("invalid input."); run();}
	});
	
}

function run(){
	inquire.prompt([
		{
			message: "What would you like to run?"
			,type: "list"
			,choices:["my-Tweets","Spotify-this-song","Movie-this","Do-what-it-says","EXIT"]
			,name:"function"
		}
	]).then(function(answers){
		if(answers.function === "my-Tweets"){myTweets();}
		else if(answers.function === "Spotify-this-song"){
			inquire.prompt([{
				message:"What song are we Spotifying?"
				,type: "input"
				,name: "song"
			}]).then(function(subAnswer){
				if(subAnswer.length > 0){spotifyThisSong(subAnswer.song);}
				else{spotifyThisSong("The Sign, ace of base");}
			});
		}
		else if(answers.function === "Movie-this"){
			inquire.prompt([{
				message:"What movie are we this-ing?"
				,type: "input"
				,name: "movie"
			}]).then(function(subAnswer){
				if(subAnswer.length > 0){movieThis(subAnswer.movie);}
				else{movieThis("Mr. Nobody");}
			});
		}
		else if(answers.function === "Do-what-it-says"){doWhatItSays();}
		if(answers.function === "EXIT"){console.log("Thank you for using the this thing!");}
	});
}