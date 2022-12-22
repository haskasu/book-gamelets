/** 檔案 src/test/RandomGenerator.test.ts */
import { test, expect } from 'vitest'
import { RandomGenerator } from '../lib/RandomGenerator'

test('next()的輸出範圍', () => {
    let rng = new RandomGenerator(Date.now());
    let tries = 100;
    while (tries--) {
        let output = rng.next();
        // 期望亂數值 >= 0 且 < 1
        expect(output)
            .greaterThanOrEqual(0)
            .lessThan(1);
    }
})
test('nextInt()的數字分布', () => {
    let rng = new RandomGenerator(Date.now());
    // 定義骰子可擲出0到9共10個面
    let maxFace = 9;
    let totalFaces = maxFace + 1;
    // 準備擲出數子的次數資料庫,把0裝到第0格至第9格
    let results: number[] = [];
    for (let i = 0; i < totalFaces; i++) {
        results.push(0);
    }
    // 準備擲10000次骰子
    let totalRolls = 10000;
    let rollCounts = 0;
    while (rollCounts++ < totalRolls) {
        // 擲出一個0到9之間的數字
        let face = rng.nextInt(maxFace);
        // 將擲出數字的次數加1
        results[face]++;
    }
    // 每面擲出的期望次數
    let expectPerFace = totalRolls / totalFaces;
    for (let face = 0; face <= maxFace; face++) {
        // 擲出的次數和期望值的差值要小於200
        let diff = Math.abs(results[face] - expectPerFace);
        expect(diff).toBeLessThan(200);
    }
})
test('亂數機的可重覆性', () => {
    let tries = 10;
    while (tries--) {
        let seed = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
        let rng1 = new RandomGenerator(seed);
        let rng2 = new RandomGenerator(seed);
        let length = 5;
        while (length--) {
            expect(rng1.next()).toBe(rng2.next());
        }
    }
})
test('隨機字串', () => {
    let rng = new RandomGenerator(Date.now());
    // 產生長度1000，並含有數字的隨機字串
    let output = rng.getRandomString(1000, true);
    // 檢查字串長度是否為1000
    expect(output.length).toBe(1000);
    // 檢查字串是否含有數字
    expect(output).toMatch(/[0-9]/);

    // 產生另一個不含數字的字串
    let output2 = rng.getRandomString(1000, false);
     // 檢查字串從頭到尾是否只有英文字
     expect(output2).toMatch(/^[a-z]{1000}$/);
})