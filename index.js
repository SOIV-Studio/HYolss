const { Client, Intents } = require('discord.js');
const randomWords = require('random-words');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.api.applications(client.user.id).commands.post({
    data: {
      name: 'HYolss',
      description: '봇 테스트중.. /오늘의메뉴',
    },
  });
});

client.ws.on('INTERACTION_CREATE', async interaction => {
  const { name } = interaction.data;

  if (name === '오늘의메뉴') {
    const word = randomWords(); // get a random word
    const response = {
      type: 4,
      data: {
        content: `..님 ${word} 어때?`,
      },
    };

    client.api.interactions(interaction.id, interaction.token).callback.post({ data: response });
  }
});

client.login('your_bot_token_here');
