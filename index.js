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

  if(message.content == '!서버정보') {
    let img = 'https://media.discordapp.net/attachments/622810138985758743/743334765100400681/20.jpg'
    let embed = new Discord.RichEmbed()
      .setTitle('우리들의 생활공간 디스코드 정보')
      .setURL()
      .setAuthor('우리들의 생활관', img)
      .setThumbnail()
      .addBlankField()
      .addField('우리들의 생활공간 디스코드', 'https://discord.gg/T55THdt')
      .addField('우리들의 생활편집관 커미션', 'https://owolcomsn.kro.kr', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here1\nSome value here2\nSome value here3\n')
      .addBlankField()
      .setTimestamp()
      .setFooter('𝓱𝓲𝓭𝓭𝓮𝓷 𝓴𝔂')
    
    message.channel.send(embed)
  } else if (msg.content.toLowerCase().startsWith("!청소")) {
      const args = msg.content.split(' ').slice(1); // All arguments behind the command name with the prefix
      const amount = args.join(' '); // Amount of messages which should be deleted
 
      if (!amount) return msg.reply('삭제할 메시지의 숫자를 적어 주세요! ex) !청소 20'); // Checks if the `amount` parameter is given
      if (isNaN(amount)) return msg.reply('청소 가능한 숫자가 너무 커요!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
 
      if (amount > 500) return msg.reply('청소가 가능한 숫자는 500개에요! 500개 이하로 숫자를 작성해주세요!'); // Checks if the `amount` integer is bigger than 100
      if (amount < 1) return msg.reply('최소 1개 이상의 메시지를 삭제 해주세요!'); // Checks if the `amount` integer is smaller than 1
 
      msg.channel.fetchMessages({ limit: amount }).then(dmsg => { // Fetches the messages
      msg.channel.bulkDelete(dmsg // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
      ).catch(console.log);});
    } else if(message.content == '!help') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: '!ping', desc: '현재 핑 상태 (제작중)'},
      {name: '!서버정보', desc: '생활공간 디스코드 정보'},
      {name: '!help', desc: 'commandList'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('Help of 우리들의 생활관 BOT', helpImg)
      .setColor('#186de6')
      .setFooter(`우리들의 생활관 BOT`)
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
