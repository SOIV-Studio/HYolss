const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

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
    message.reply('는 응애야.. 지켜줘야되..');
  }

  if(message.content == '!봇정보') {
    let img = 'https://media.discordapp.net/attachments/622810138985758743/743334765100400681/20.jpg'
    let embed = new Discord.RichEmbed()
      .setTitle('HYolss BOT 정보')
      .setURL()
      .setAuthor('얀녕! 날 소계 해줄게!', img)
      .setThumbnail()
      .addBlankField()
      .addField('나의 집사는 000 이야', '')
      .addField('집자 커미션 사이트', 'https://bit.ly/comsIVsNT', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here1\nSome value here2\nSome value here3\n')
      .addBlankField()
      .setTimestamp()
      .setColor('#186de6')
      .setFooter('HYolss BOT')
    
    message.channel.send(embed)
  } 
  
  if(message.content == '!help') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: '!봇정보', desc: '사용 금지'},
      {name: '!help', desc: 'commandList'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('Help of HYolss BOT', helpImg)
      .addField(commandList)
      .setColor('#186de6')
      .setFooter('HYolss BOT')
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
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
