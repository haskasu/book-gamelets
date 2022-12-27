import { BaseTexture, Sprite, Texture } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import cannonImage from '../images/cannon.png';
import { getStageSize } from "../main";
import { keyboardManager } from "../lib/keyboard/KeyboardManager";
import { KeyCode } from "../lib/keyboard/KeyCode";

export class PlayerCannon {
    // 砲台的圖
    sprite = new Sprite();
    // 砲台移動速度(像素/tick)
    moveSpeed = 1;
    // 射擊冷卻時間(毫秒)
    shootCooldown = 100;

    constructor(public game: SpaceInvadersGame) {
        // 載入圖片
        let baseTexture = BaseTexture.from(cannonImage);
        // 建立材質
        let texture = new Texture(baseTexture);
        // 新增精靈圖
        this.sprite.texture = texture;
        // 把精靈圖放到舞台上
        game.app.stage.addChild(this.sprite);
        // 調整砲台到畫面底部的正中央
        let stageSize = getStageSize();
        this.sprite.position.set(
            stageSize.width / 2,
            stageSize.height
        );
        // 依流程調整圖片軸心
        if (baseTexture.valid) {
            this.adjustPivot();
        } else {
            baseTexture.once('loaded', () => {
                this.adjustPivot();
            });
        }
        // 開始進行砲台移動
        game.app.ticker.add(this.moveUpdate, this);
    }

    destroy(): void {
        this.sprite.destroy();
        this.game.app.ticker.remove(this.moveUpdate, this);
    }
    /**
     * 調整圖片的軸心位置(底部/置中)
     */
    private adjustPivot() {
        this.sprite.pivot.set(
            this.sprite.width / 2,
            this.sprite.height
        );
    }
    /**
     * 砲台移動的更新函式
     * @param dt 經過時間
     */
    private moveUpdate(dt: number) {
        const sprite = this.sprite;
        let x = sprite.x;
        let distance = dt * this.moveSpeed;

        if (keyboardManager.isKeyDown(KeyCode.LEFT)) {
            x -= distance;
        }
        if (keyboardManager.isKeyDown(KeyCode.RIGHT)) {
            x += distance;
        }
        // 限制x的範圍
        x = Math.max(sprite.width / 2, x);
        x = Math.min(getStageSize().width - sprite.width / 2, x);
        sprite.x = x;
    }
}