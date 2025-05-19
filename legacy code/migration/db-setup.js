const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateDataToSupabase() {
    try {
        console.log('데이터베이스 마이그레이션 시작...');
        
        // 메뉴 파일 경로
        const menuPath = path.join(__dirname, 'random-words-store', 'menu.txt');
        const conveniencePath = path.join(__dirname, 'random-words-store', 'convenience.txt');
        
        // 파일에서 데이터 읽기
        const menuContent = fs.readFileSync(menuPath, 'utf8');
        const convenienceContent = fs.readFileSync(conveniencePath, 'utf8');
        
        // 데이터 정리
        const menuItems = menuContent.split('\n').map(item => item.trim()).filter(item => item !== '');
        const convenienceItems = convenienceContent.split('\n').map(item => item.trim()).filter(item => item !== '');
        
        // 메뉴 테이블 데이터 생성
        const menuData = menuItems.map(item => ({
            name: item,
            type: 'menu'
        }));
        
        // 편의점 메뉴 테이블 데이터 생성
        const convenienceData = convenienceItems.map(item => ({
            name: item,
            type: 'convenience'
        }));
        
        // 모든 데이터 합치기
        const allData = [...menuData, ...convenienceData];
        
        // Supabase에 데이터 삽입
        const { data, error } = await supabase
            .from('menu_items')
            .insert(allData);
            
        if (error) {
            throw new Error(`Supabase 에러: ${error.message}`);
        }
        
        console.log('데이터베이스 마이그레이션 완료!');
        console.log(`일반 메뉴 ${menuItems.length}개, 편의점 메뉴 ${convenienceItems.length}개가 추가되었습니다.`);
        
    } catch (error) {
        console.error('마이그레이션 중 오류 발생:', error);
    }
}

// 마이그레이션 실행
migrateDataToSupabase();
