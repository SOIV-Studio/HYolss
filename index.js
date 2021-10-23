const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;
var port = process.env.PORT || 8080;

client.on('ready', () => {
  console.log('온라인!');
  client.user.setActivity('도움말 명령어는 !help', { type: 'PLAYING' })
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content === '온라인') {
    message.reply('서버 체크 완료!');
  }
  
  if(message.content === '응애') {
    message.reply('는(은) 응애야.. 지켜줘야되..');
  }

  if(message.content == '!봇정보') {
    const embed = new Discord.MessageEmbed()
      .setColor('#186de6')
      .setTitle('HYolss BOT 정보')
      .setURL()
      .setAuthor('얀녕! 날 소계 해줄게!')
      .setThumbnail()
      .addField('나의 집사는 000 이야', '')
      .addField('집사 커미션 사이트', 'https://bit.ly/comsIVsNT')
      .setTimestamp()
      .setFooter('HYolss BOT')
    
      msg.channel.send(embed);
  } 

  if(message.content == '!help') {
    const embed = new Discord.MessageEmbed()
      .setColor('186de6')
      .setAuthor('Help of HYolss BOT', 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png')
      .setTitle('나의 명령어를 알러줄깨!')
      .addField(
		  	{name: '!봇정보', value: '사용 금지', inline: true},
      	{name: '!help', value: 'commandList', inline: true},
      )
      .setFooter('HYolss BOT')

      msg.channel.send(embed);
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
