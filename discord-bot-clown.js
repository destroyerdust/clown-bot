/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

var config = require('./config.json')

// Import the discord.js module
const Discord = require('discord.js');
var Gamedig = require('gamedig');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.discordBot.token;

const MOHAA_SERVER = config.gameServers.MOHAA.host;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    //console.log(message);
	if(message.channel.name === 'roboto'){
	// If the message is "ping"
    	if (message.content === 'ping') {
    	   // Send "pong" to the same channel
    	   message.channel.send('pong');
    	}
        if (message.content === '!server') {

            Gamedig.query({
            	type: 'mohaa',
            	host: MOHAA_SERVER
            },
            function(e,state) {
            	if(e){
                    message.channel.send('Server is Offline!');
                }else{

                    var build_message = "";
                    build_message += "MOHAA SERVER NAME: " + state.name + "\n";
                    build_message += "MOHAA SERVER IP: " + MOHAA_SERVER + "\n";
                    build_message += "MOHAA SERVER MAP: " + state.map + "\n";
                    build_message += "MAX PLAYERS: " + state.maxplayers + "\n";
                    build_message += "PASSWORD?: " + state.password + "\n";
                    
                    playersArray = state.players;
                    var players = "";
                    for (var i = 0, len = playersArray.length; i < len; i++) {
                        if(i >= 1){
                            players += ", ";
                        }
                        players += playersArray[i].player;
                    }
                    build_message += "Players: " + players + "\n";
                    
                    message.channel.send(build_message);
                }
            });
        }
	}
  
});

// Log our bot in
client.login(token);