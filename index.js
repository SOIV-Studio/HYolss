const { CommandClient } = require('eris')

// Stupid ass bot creation
async function init(token) {
    const stupidAssBot = new CommandClient(`Bot ${token}`, { intents: ['guilds'], maxShards: 'auto',restMode: true })
    // Register the stupid ass command
    stupidAssBot.on('ready', async () => {
        await stupidAssBot.bulkEditCommands([{
            name: 'lol',
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
            console.log('Self destructing...')
            process.exit(0)
        }
    })
    stupidAssBot.connect();
}

client.once('ready', () => {
  console.log('Ready!');
  client.user.setPresence({ game: { name: '도움말 명령어는 !help' }, status: 'online' })
});

client.on("message", msg => {
  if(message.content === '응애') {
    message.reply('는(은) 응애야.. 지켜줘야되..');
  }

  if(message.content === '!help') {
    message.reply('help는 없는 명령어 입니다. (명령어 생성 안되어 있음)');
  }
});

const tokenFromStupidCommand = process.argv[2]
init(tokenFromStupidCommand);
