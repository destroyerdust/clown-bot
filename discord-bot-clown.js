//Prod
var config = require('./config.json');
const Discord = require('discord.js')
var Gamedig = require('gamedig');
// Create an instance of a Discord client
const client = new Discord.Client();
const token = config.discordBot.token;
var clownInfo = require('./data.json');
const channelName = clownInfo.discordBot.channel;
const prefix = clownInfo.discordBot.prefix;
const MOHAA_SERVER = clownInfo.gameServers.MOHAA.host;
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
    let userCommand = command.toLowerCase();
    if (!command.startsWith(prefix)) return;
    if (message.channel.name === channelName) {
        let serverEmbed = new Discord.RichEmbed().setTitle("[CLOWN] Public Commands");
        // Available Commands
        if (userCommand === `${prefix}commands`) {
            for (var available_commands of clownInfo.commands) {
                serverEmbed.addField(prefix + available_commands.name, available_commands.description)
            }
            message.channel.send({
                embed: serverEmbed
            });
        }
        // Current Ranks
        if (userCommand === `${prefix}ranks`) {
            let serverEmbed = new Discord.RichEmbed().setTitle("[CLOWN] Ranks").setDescription(clownInfo.ranks)
            message.channel.send({
                embed: serverEmbed
            });
        }
        // Current Version
        if (userCommand === `${prefix}version`) {
            let serverEmbed = new Discord.RichEmbed().setTitle("[CLOWN] Discord Bot Version").setDescription(clownInfo.version)
            message.channel.send({
                embed: serverEmbed
            });
        }
        // Ping Pong!
        if (userCommand === `${prefix}ping`) {
            // Send "pong" to the same channel
            message.channel.send('Pong!');
        }
        // Mohaa Server Info Embed
        if (userCommand === `${prefix}server`) {
            Gamedig.query({
                type: 'mohaa',
                host: MOHAA_SERVER
            }, function(e, state) {
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
                    let serverEmbed = new Discord.RichEmbed().setTitle("[CLOWN] Server Information").setDescription("This is the [CLOWN] Server Info").addField("Server Name:", state.name).addField("Server IP: ", MOHAA_SERVER).addField("Server Map: ", state.map).addField("Max Players: ", state.maxplayers).addField("Password? ", state.password).addField("Players: ", "Current Players: " + players).setFooter("Info provided by GameDig Node JS Project").setTimestamp();
                    message.channel.send({
                        embed: serverEmbed
                    });
                }
            });
        }
        // Work in Progress User Info
        if (command === `${prefix}userinfo`) {
            let embed = new Discord.RichEmbed().setTitle("User Info").setAuthor(message.author.username).setDescription("UserInfo!").setColor("#9B59B6").setFooter("Footer Text").setTimestamp();
            message.channel.send({
                embed
            });
        }
    }
});
// Log our bot in
client.login(token);