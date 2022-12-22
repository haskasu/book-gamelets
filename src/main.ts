import './lib/RectUtils'
import './lib/PointUtils'
import { Application, Graphics } from 'pixi.js';
import './style.css'
//import { TreeGenerator } from './tree-generator/TreeGenerator';
import { SpaceInvadersGame } from './space-invaders/SpaceInvadersGame';

let app = new Application<HTMLCanvasElement>();
document.body.appendChild(app.view);
// 使用一般物件來儲存舞台的尺寸
let stageSize = {
    width: 0,
    height: 0,
};
// 新增一個繪圖元件來畫舞台的外框
let stageFrame = new Graphics();
// app.stage.addChild(stageFrame);
/**
 * 重繪舞台的外框
 */
function redrawStageFrame(): void {
    stageFrame.clear();
    stageFrame.lineStyle({
        color: 0xFF0000,
        width: 2,
    });
    stageFrame.drawRect(
        0,               // x
        0,               // y
        stageSize.width, // 寬
        stageSize.height // 高
    );
}
/**
 * 用來指定舞台大小的函式
 */
function setStageSize(width: number, height: number): void {
    stageSize.width = width;
    stageSize.height = height;
    redrawStageFrame();
    refreshCanvasAndStage();
}
/**
 * 根據舞台尺寸(stageSize)與瀏覽器視窗大小
 * 來調整app.stage的縮放與位置
 */
function refreshCanvasAndStage(): void {
    // 首先取得瀏覽器的視窗大小
    let winSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // 將app裏的畫布尺寸同步到視窗大小
    app.renderer.resize(winSize.width, winSize.height);
    // 計算舞台最多可以放大多少倍，才能儘量占滿視窗又不超出畫面
    let scale = Math.min(
        winSize.width / stageSize.width,
        winSize.height / stageSize.height
    );
    // 將舞台按計算結果縮放尺寸
    app.stage.scale.set(scale);
    // 計畫舞台在經過縮放後的實際尺寸
    let stageRealSize = {
        width: stageSize.width * scale,
        height: stageSize.height * scale,
    };
    // 計算並平移舞台位置，讓舞台置中於視窗內
    app.stage.position.set(
        (winSize.width - stageRealSize.width) / 2,
        (winSize.height - stageRealSize.height) / 2,
    );
}
// 設定舞台尺寸
setStageSize(640, 480);
// 監聽視窗的 resize 事件
// 在發生改變成執行 refreshCanvasAndStage()
window.addEventListener('resize', refreshCanvasAndStage);
/**
 * 匯出取得舞台尺寸的函式
 */
export function getStageSize() {
    return {
        width: stageSize.width,
        height: stageSize.height,
    }
}

// new TreeGenerator(app);
new SpaceInvadersGame(app);