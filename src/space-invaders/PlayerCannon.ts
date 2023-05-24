import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import cannonImage from '../images/cannon.png';
import { getStageSize, wait } from "../main";
import { keyboardManager } from "../lib/keyboard/KeyboardManager";
import { KeyCode } from "../lib/keyboard/KeyCode";
import { Cannonball } from "./Cannonball";
import cannonShootSnd from '../sounds/cannonShoot.wav';
import { playSound } from "../lib/SoundUtils";
import invadersImage from '../images/invaders.png';
import cannonExplodeSnd from '../sounds/cannonExplode.wav';

export class PlayerCannon {
    // 砲台的圖
    sprite = new Sprite();
    // 砲台移動速度(像素/tick)
    moveSpeed = 1;
    // 射擊冷卻時間(幀)
    shootCooldown = 0;
    // 是否已被破壞
    dead = false;

    constructor(public game: SpaceInvadersGame) {
        // 載入圖片
        let baseTexture = BaseTexture.from(cannonImage);
        // 建立材質
        let texture = Texture.from(baseTexture);
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
        // 開始進行砲台射擊
        game.app.ticker.add(this.shootUpdate, this);
    }

    destroy(): void {
        this.sprite.destroyed || this.sprite.destroy();
        this.stop();
    }
    private stop() {
        this.game.app.ticker.remove(this.moveUpdate, this);
        this.game.app.ticker.remove(this.shootUpdate, this);
        this.dead = true;
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
        let minX = sprite.width / 2;
        let maxX = getStageSize().width - sprite.width / 2;
        x = Math.max(minX, x);
        x = Math.min(maxX, x);
        sprite.x = x;
        // 處理砲台和外星人們的碰撞
        let hitInvader = this.hittestInvaders();
        // 如果有找到撞到的外星人
        if (hitInvader) {
            this.game.hitPlayerCannon();
        }
    }
    /**
     * 處理砲台和外星人們的碰撞
     * 回傳被撞到的外星人
     */
    private hittestInvaders() {
        let bounds = this.sprite.getBounds();
        return this.game.invaders.find((invader) => {
            return invader.sprite.getBounds().intersects(bounds);
        });
    }
    /**
     * 砲台射擊的更新函式
     * @param dt 經過時間
     */
    private shootUpdate(dt: number) {
        this.shootCooldown -= dt;
        if (
            this.shootCooldown <= 0 &&
            keyboardManager.isKeyDown(KeyCode.SPACE)
        ) {
            this.shootCooldown = 60;
            this.createCannonball();
        }
    }
    private async createCannonball() {
        new Cannonball(this.game, this.sprite.x, this.sprite.y);
        let instance = await playSound(cannonShootSnd);
        instance.volume = 0.2;
    }
    /**
     * 砲台爆炸時的動畫與程序
     */
    async hitAndDead() {
        // 停止移動與射擊，並設定砲台已破壞
        this.stop();
        // 播放爆炸音效
        playSound(cannonExplodeSnd, { volume: 0.2 });
        // 改變材質為外星人的材質基底最右側的frame
        const baseTexture = BaseTexture.from(invadersImage);
        const frame = new Rectangle(200, 0, 50, 34);
        const texture = new Texture(baseTexture, frame);
        // 改用外星人被擊落時的特效
        this.sprite.texture = texture;
        this.sprite.pivot.set(frame.width / 2, frame.height);
        // 改變精靈圖的色調
        this.sprite.tint = 0x00FF00;
        // 等待30個ticks
        await wait(30);
        // 自我清除
        this.destroy();
    }
}