const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// 랜덤 단어 파일에서 단어들을 읽어오는 함수
function getRandomWord() {
    try {
        const wordsPath = path.join(__dirname, '..', '..', 'random-words-store', 'convenience.txt');
        console.log('Reading file from path:', wordsPath);
        
        const fileContent = fs.readFileSync(wordsPath, 'utf8');
        const words = fileContent.split('\n').map(word => word.trim()).filter(word => word !== '');
        
        if (words.length === 0) {
            throw new Error('No words found in the file');
        }
        
        return words[Math.floor(Math.random() * words.length)];
    } catch (error) {
        console.error('Error in getRandomWord:', error);
        throw error;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('오늘의편의점')
        .setDescription('오늘의 편의점 메뉴를 추천해줍니다.'),
    async execute(interaction) {
        try {
            const nickname = interaction.member.displayName;
            const randomWord = getRandomWord();
            
            await interaction.reply({
                content: `${nickname}님 ${randomWord} 어때?`,
                ephemeral: false
            });
        } catch (error) {
            console.error('Error in 오늘의편의점 command:', error);
            await interaction.reply({
                content: '메뉴를 추천하는 중에 오류가 발생했습니다.',
                ephemeral: true
            });
        }
    },
};