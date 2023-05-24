import { Rectangle } from "pixi.js";
import { getStageSize } from "../main";
import { Cannonball } from "./Cannonball";

export class InvaderDrop extends Cannonball {

    protected getSpriteTextureFrame(): Rectangle {
        return new Rectangle(6, 0, 6, 14);
    }
    /**
     * 外星人飛彈的移動函式
     */
    moveUpdate(dt: number) {
        const sprite = this.sprite;
        let speed = 2;
        sprite.y += dt * speed;

        // 往下超出舞台範圍時，刪掉自己
        if (sprite.y > getStageSize().height + sprite.height) {
            this.destroy();
        } else {
            const cannon = this.game.cannon;
            // 砲台沒死才要檢查碰撞
            if (!cannon.dead) {
                const cannonBounds = cannon.sprite.getBounds();
                // 測試有沒有撞到玩家砲台
                if (cannonBounds.intersects(sprite.getBounds())) {
                    // 呼叫game裏處理砲台毀壞的函式
                    this.game.hitPlayerCannon();
                    // 再把自己也銷毀
                    this.destroy();
                }
            }
        }
        // 如果到這裏，sprite還沒被銷毀，代表飛彈還活著
        if (!this.sprite.destroyed) {
            let shield = this.hittestShields();
            if (shield) {
                shield.onHit();
                this.destroy();
            }
        }
    }
}
