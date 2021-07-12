const mockData = require('../../data/mock');

/*
EXPECTED OUTPUT: 

nameVar
ownerVar (OS)
lastSaleVar (OS)
speciesVar   bodyVar   backgroundVar
eyesVar   mouthVar clothesVAr
hatVar hornsVar(this one might be removed)
imageVar
*/

const getTraits = (attributes) => {
    let strings = []
    let data = attributes.attributes ? attributes.attributes : []
    for (let i = 0; i < data.length; i++) {
        let traitType = data[i].trait_type;
        let value = data[i].value;
        strings.push(`\n**${traitType}**: ${value}\n`)
    }
    
    return strings
}

const getId = (data) => {
    let newArr = [];
    for (let i = 0; i < data.length; i++) {
        let newObj = data[i];
        newObj['id'] = data[i].name.match(/\d+/g)[0];
        newArr.push(newObj)
    }
    return newArr
}

module.exports = {
    name: 'id',
    description: 'Get info based on ID.',
    args: true,
    usage: '<id>',
    aliases: ['monster', 'number'],
    cooldown: 5,
    execute(message, args) {

        // This returns an array that is searchable by id
        const newArr = getId(mockData);

        let filtered = newArr.filter(obj => obj.id === args[0] || obj.id === args[0].toString());
        console.log(filtered)
        if (filtered.length > 0) {
            let msg = 'CONGRATS! This monster exists!'

            let attributeStrings =  getTraits(filtered[0])
            for (let i = 0; i < attributeStrings.length; i++) {
                msg += attributeStrings[i]
            }
            return message.channel.send(msg)
        }
        if (args[0] < 0 || args[0] > 7999) {
            return message.channel.send('You must provide a number between 0 and 7999.')
        }
        if (isNaN(args[0])) {
            return message.channel.send('you must provide a number.')
        }
        if (filtered.length === 0) {
            return message.channel.send('I can not find that monster!')
        } 

        message.channel.send(`First argument: ${args[0]}`);
    }
}