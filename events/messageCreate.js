const { Collection } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        const client = message.client;
        
        // 봇이 보낸 메시지는 무시
        if (message.author.bot) return;
        
        // 접두사 확인 (! 또는 = 사용)
        const prefixes = ['!', '='];
        const prefix = prefixes.find(p => message.content.startsWith(p));
        
        // 접두사가 없으면 무시
        if (!prefix) return;
        
        // 명령어와 인자 추출
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // 명령어 컬렉션이 없으면 생성
        if (!client.prefixCommands) {
            client.prefixCommands = new Collection();
            
            // 모든 명령어 파일에서 접두사 명령어 정보 추출
            const commandFolders = ['default', 'utility']; // 필요에 따라 다른 폴더 추가
            
            for (const folder of commandFolders) {
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const commandsPath = path.join(__dirname, '..', 'commands', folder);
                    
                    // 폴더가 존재하는지 확인
                    if (!fs.existsSync(commandsPath)) continue;
                    
                    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                    
                    for (const file of commandFiles) {
                        const filePath = path.join(commandsPath, file);
                        const command = require(filePath);
                        
                        // prefixCommand 속성이 있는 명령어만 등록
                        if (command.prefixCommand) {
                            client.prefixCommands.set(command.prefixCommand.name, command);
                            
                            // 별칭 등록
                            if (command.prefixCommand.aliases) {
                                for (const alias of command.prefixCommand.aliases) {
                                    client.prefixCommands.set(alias, command);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`[ERROR] Error loading prefix commands from ${folder} folder:`, error);
                }
            }
        }
        
        // 명령어 찾기
        const command = client.prefixCommands.get(commandName);
        
        // 명령어가 없으면 무시
        if (!command) return;
        
        // 명령어 실행
        try {
            await command.executePrefix(message, args);
        } catch (error) {
            console.error(`[ERROR] Error executing prefix command ${commandName}:`, error);
            await message.reply('명령어 실행 중 오류가 발생했습니다.');
        }
    },
};