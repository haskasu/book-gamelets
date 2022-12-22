import { Point, Sprite } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";

export class PlayerCannon {
    // 砲台的圖
    sprite = new Sprite();
    // 射擊冷卻時間
    shootCooldown = 0;

    constructor(
        public game: SpaceInvadersGame, // 遊戲容器
        public position: Point          // 砲台位置
    ) {

    }

    destroy(): void {
        this.sprite.destroy();
    }
}