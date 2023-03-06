import { Container, Point, Ticker } from "pixi.js";

export interface ICamera2DObject {
    x: number;
    y: number;
}

export class Camera2D {
    // 攝影機的位置
    position = new Point();
    // 攝影機的畫面長寬
    width = 0;
    height = 0;
    // 攝影機聚焦的物件
    focus?: ICamera2DObject;
    // 實際會被攝影機移動的Pixi容器
    gameRoot?: Container;
    // 攝影機跟隨聚焦物件的速率
    followFocusRate = 0.2;

    constructor(private ticker: Ticker) {
        ticker.add(this.update, this);
    }
    destroy() {
        this.ticker.remove(this.update, this);
    }
    private update() {
        const focus = this.focus;
        const position = this.position;
        // 跟隨聚焦物件
        if (focus) {
            const rate = this.followFocusRate;
            const invertRate = 1 - rate;
            this.position.set(
                focus.x * rate + position.x * invertRate,
                focus.y * rate + position.y * invertRate,
            );
        }
        // 移動容器原點
        if (this.gameRoot) {
            this.gameRoot.x = this.width / 2 - position.x;
            this.gameRoot.y = this.height / 2 - position.y;
        }
    }
}