const { CommandClient } = require('eris')

// Stupid ass bot creation
async function init(token) {
    const stupidAssBot = new CommandClient(`Bot ${token}`, { intents: ['guilds'], maxShards: 'auto',restMode: true })
    // Register the stupid ass command
    stupidAssBot.on('ready', async () => {
        await stupidAssBot.bulkEditCommands([{
            name: 'HYolss',
            description: 'I hate discord so much you cannot believe it',
            type: 1,
        }])
        console.log(`Paste the URL below into your browser to invite your bot!\nhttps://discord.com/oauth2/authorize?client_id=${stupidAssBot.user.id}&scope=applications.commands%20bot&permissions=3072`)
    })
    // Stupid ass interaction creation event
    stupidAssBot.on('interactionCreate', async (interaction) => {
        if (interaction?.data?.name === 'ping') {
            await interaction.createMessage({
                content: 'Pong!'
            })
            console.log('ping.. Pong!')
            process.exit(0)
        }
    })
    stupidAssBot.on('interactionCreate', async (interaction) => {
        if (interaction?.data?.name === 'help') {
            await interaction.createMessage({
                content: 'help 명령어 등록 대기중'
            })
            console.log('command List')
            process.exit(0)
        }
    })
    stupidAssBot.connect();
}

const tokenFromStupidCommand = process.argv[2]
init(tokenFromStupidCommand);
