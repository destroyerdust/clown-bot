/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

//Prod
var config = require('./config.json')

//Dev
//var config = require('./dev-config.json')

const channelName = config.discordBot.channel
const prefix = config.discordBot.prefix;

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
    console.log(`${client.user.username} is ready!`);
});

// Create an event listener for messages
client.on('message', message => {

    // Don't reply to Bots or DM's
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    // Command with Argument Parser IN PROGRES
    let messageArray = message.content.split(" ");
    let command = messageArray[0]
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    if (message.channel.name === channelName) {

        // Ping Pong!
        if (message.content === `${prefix}ping`) {
            // Send "pong" to the same channel
            message.channel.send('Pong!');
        }

        // Mohaa Server Info Embed
        if (message.content === `${prefix}server`) {

            Gamedig.query({
                type: 'mohaa',
                host: MOHAA_SERVER
            },
                function (e, state) {
                    if (e) {
                        console.log(e);
                        message.channel.send('Server is Offline!');
                    } else {
                        var playersArray = state.players;
                        var players = "";
                        for (var i = 0, len = playersArray.length; i < len; i++) {
                            if (i >= 1) {
                                players += ", ";
                            }
                            players += playersArray[i].player;
                        }

                        if (!players) {
                            players = " "
                        }

                        let serverEmbed = new Discord.RichEmbed()
                            .setTitle("[CLOWN] Server Information")
                            .setDescription("This is the [CLOWN] Server Info")
                            .addField("Server Name:", state.name)
                            .addField("Server IP: ", MOHAA_SERVER)
                            .addField("Server Map: ", state.map)
                            .addField("Max Players: ", state.maxplayers)
                            .addField("Password? ", state.password)
                            .addField("Players: ","Current Players: " || players)
                            .setFooter("Info provided by GameDig Node JS Project")
                            .setTimestamp();

                        message.channel.sendEmbed(serverEmbed);
                    }
                });
        }

        // Work in Progress User Info
        if (command === `${prefix}userinfo`) {
            let embed = new Discord.RichEmbed()
                .setTitle("User Info")
                .setAuthor(message.author.username)
                .setDescription("UserInfo!")
                .setColor("#9B59B6")
                .setFooter("Footer Text")
                .setTimestamp();

            message.channel.send({ embed });
        }
    }

});

// Log our bot in
client.login(token);