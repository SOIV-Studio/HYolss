const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;
var port = process.env.PORT || 8080;

client.once('ready', () => {
  console.log('Ready!');
  client.user.setPresence({ game: { name: '도움말 명령어는 !help' }, status: 'online' })
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content === '온라인') {
    message.reply('서버 체크 완료!');

});

client.on("message", msg => {
  if (msg.content === "!ping") {
    msg.reply("Pong!")
  }

  if(message.content === '응애') {
    message.reply('는(은) 응애야.. 지켜줘야되..');
  }

  if(message.content === '!help') {
    message.reply('help는 없는 명령어 입니다. (명령어 생성 안되어 있음)');
  }
});

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

client.login(token);
