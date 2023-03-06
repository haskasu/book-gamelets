import { Application, Point, Rectangle } from "pixi.js";
// 滑鼠的全域座標(滑鼠在遊戲畫面上的位置)
export const mouseGlobal = new Point();
// 啟動追蹤滑鼠座標的程序
export function startMouseTracer(app: Application) {
    let stage = app.stage;
    // 開啟舞台的互動開關
    stage.interactive = true;
    // 加大舞台與滑鼠互動的範圍
    stage.hitArea = new Rectangle(-10000, -10000, 20000, 20000);
    // 註冊滑鼠移動事件
    stage.on('pointermove', (event) => {
        // 取得滑鼠在遊戲畫面上的位置
        mouseGlobal.copyFrom(event.global);
    });
    // 註冊手指觸碰事件
    stage.on('pointerdown', (event) => {
        // 取得滑鼠在遊戲畫面上的位置
        mouseGlobal.copyFrom(event.global);
    });
}
