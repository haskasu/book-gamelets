import { BaseTexture, Sprite, Texture } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import cannonImage from '../images/cannon.png';
import { getStageSize } from "../main";
import { keyboardManager } from "../lib/keyboard/KeyboardManager";

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
        baseTexture.on('loaded', () => {
            console.log('width = ' + this.sprite.width);
            console.log('height = ' + this.sprite.height);
            this.sprite.pivot.set(
                this.sprite.width / 2,
                this.sprite.height
            );
        });

        keyboardManager.on('pressed', (event: KeyboardEvent) => {
            console.log('pressed: ' + event.code + ', '  + event.key);
        })

    }

    destroy(): void {
        this.sprite.destroy();
    }
}