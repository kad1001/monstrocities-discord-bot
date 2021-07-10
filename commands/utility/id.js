module.exports = {
    name: 'id',
    description: 'Get info based on ID.',
    args: true,
    usage: '<id>',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Hi.');
        if (args[0] === 67) {
            return message.channel.send(67);
        }
        if (args[0] < 0 && args[0] > 7999) {
            return message.channel.send('You must provide a number between 0 and 7999.')
        }
        if (isNaN(args[0])) {
            return message.channel.send('you must provide a number.')
        }
        message.channel.send(`First argument: ${args[0]}`);
    }
}