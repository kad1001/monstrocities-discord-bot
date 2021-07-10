const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

// This will be replaced!!
// const data = require('./data/mock');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// Listening for messages
client.on('message', message => {
    // if the message either doesn't start with the prefix or the author is a box, exit early
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // args slices off the prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // command takes the first element in args arr and return it & remove it from args
    const commandName = args.shift().toLowerCase();

    // TODO - add aliases array to commands
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


    if (!command) return;


    // Help user correctly provide arguments
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    // Implement cooldowns to avoid spam
    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now();
    // A reference to the Collection of user-ID and timestamp key/value pairs for the triggered command
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3 * 1000);
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }    
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        // console.log(message);
        // console.log(args);
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!')
    }
});

// login to discord for client app
client.login(token);
