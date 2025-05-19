const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateConvenienceDataOnly() {
    try {
        console.log('편의점 메뉴 데이터 마이그레이션 시작...');
        
        // 편의점 메뉴 파일 경로
        const conveniencePath = path.join(__dirname, 'random-words-store', 'convenience.txt');
        
        // 파일에서 데이터 읽기
        const convenienceContent = fs.readFileSync(conveniencePath, 'utf8');
        
        // 데이터 정리
        const convenienceItems = convenienceContent.split('\n').map(item => item.trim()).filter(item => item !== '');
        
        console.log(`편의점 메뉴 항목 ${convenienceItems.length}개를 발견했습니다:`, convenienceItems);
        
        // 편의점 메뉴 테이블 데이터 생성
        const convenienceData = convenienceItems.map(item => ({
            name: item,
            type: 'convenience'
        }));
        
        // 데이터 하나씩 삽입 (오류 발생 시 건너뛰기)
        let successCount = 0;
        let failCount = 0;
        
        for (const item of convenienceData) {
            try {
                // 이미 존재하는지 확인
                const { data: existing } = await supabase
                    .from('menu_items')
                    .select('id')
                    .eq('name', item.name)
                    .eq('type', item.type);
                
                if (existing && existing.length > 0) {
                    console.log(`'${item.name}' 메뉴는 이미 존재합니다. 건너뜁니다.`);
                    failCount++;
                    continue;
                }
                
                // 데이터 삽입
                const { error } = await supabase
                    .from('menu_items')
                    .insert([item]);
                
                if (error) {
                    console.error(`'${item.name}' 추가 중 오류:`, error.message);
                    failCount++;
                } else {
                    console.log(`'${item.name}' 메뉴가 성공적으로 추가되었습니다.`);
                    successCount++;
                }
            } catch (err) {
                console.error(`'${item.name}' 처리 중 예외 발생:`, err);
                failCount++;
            }
        }
        
        console.log('편의점 메뉴 데이터 마이그레이션 완료!');
        console.log(`총 결과: 성공 ${successCount}개, 실패 ${failCount}개`);
        
    } catch (error) {
        console.error('마이그레이션 중 오류 발생:', error);
    }
}

// 마이그레이션 실행
migrateConvenienceDataOnly();
