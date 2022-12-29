import { Rectangle } from "pixi.js";
import { getStageSize } from "../main";
import { Cannonball } from "./Cannonball";

export class InvaderDrop extends Cannonball {

    protected getSpriteTextureFrame(): Rectangle {
        return new Rectangle(6, 0, 6, 14);
    }
    /**
     * 外星彈的移動函式
     */
    moveUpdate(dt: number): void {
        const sprite = this.sprite;
        let speed = 2;
        sprite.y += dt * speed;

        // 往上超出舞台範圍時，刪掉自己
        if (sprite.y > getStageSize().height + sprite.height) {
            this.destroy();
        } else {
            // 測試有沒有撞到玩家砲台
            const cannon = this.game.cannon;
            if (!cannon.dead) {
                const cannonBounds = cannon.sprite.getBounds();
                if (cannonBounds.intersects(sprite.getBounds())) {
                    // 呼叫game裏處理砲台毀壞的函式
                    this.game.hitPlayerCannon();
                    // 再把自己也清掉
                    this.destroy();
                }
            }
        }
    }
}
