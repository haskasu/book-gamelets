import { Point } from "pixi.js";
import { getStageSize, wait } from "../main";
import { Invader } from "./Invader";
import { SpaceInvadersGame } from "./SpaceInvadersGame";

export class InvaderBoss extends Invader {
    /** 
     * 目前的行為模式，只能指定為idle或attack
     * 預設為idle
     */
    mode: 'idle' | 'attack' | 'back' = 'idle';
    // 魔王在群體中的位置
    posInFlock = new Point();
    // 移動速度
    velocity = new Point();
    // 旋轉時間
    rotateTime = 0;
    // 旋轉角速度
    rotateSpeed = 0;

    constructor(
        game: SpaceInvadersGame,
        x: number,    // 初始位置 x
        y: number,    // 初始位置 y
    ) {
        // 魔王的造形type強迫為3
        super(game, x, y, 3);
        this.posInFlock.set(x, y);
        this.goIdle();
    }
    private removeUpdateFunctions() {
        this.game.app.ticker.remove(this.attackUpdate, this);
        this.game.app.ticker.remove(this.backUpdate, this);
    }
    destroy(): void {
        super.destroy();
        this.removeUpdateFunctions();
    }
    private async goIdle() {
        this.removeUpdateFunctions();
        this.mode = 'idle';
        await wait(300);
        if (!this.destroyed) {
            this.goAttack();
        }
    }
    private goAttack() {
        this.removeUpdateFunctions();
        this.mode = 'attack';
        this.game.app.ticker.add(this.attackUpdate, this);
        // 初始速度往上
        this.velocity.set(0, -0.2);
        // 旋轉時間: 210 ticks
        this.rotateTime = 210;
        // 旋轉角速度(預設正值:順時針)
        this.rotateSpeed = 0.02;
        const cannon = this.game.cannon;
        if (cannon && !cannon.dead) {
            // 如果玩家砲台在右方
            if (cannon.sprite.x > this.x) {
                // 改為逆時針
                this.rotateSpeed *= -1;
            }
        } else if (Math.random() < 0.5) {
            // 如果砲台已不在，亂數決定要不要逆時針
            this.rotateSpeed *= -1;
        }
    }
    private attackUpdate(dt: number) {
        // 取得目前速率
        let currSpeed = this.velocity.length();
        // 以0.02的加速度加快速率，最大值為4
        let speed = Math.min(4, currSpeed + 0.02 * dt);
        // 將速度的長度調整為新的速率
        this.velocity.normalize(speed);
        // 如果還有旋轉時間
        if (this.rotateTime > 0) {
            // 縮短旋轉時間
            this.rotateTime -= dt;
            // 將速度方向以rotateSpeed角速度旋轉
            this.velocity.rotate(this.rotateSpeed * dt);
        }
        // 以速度的向量改變目前位置
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        if (this.y > getStageSize().height + this.height) {
            // 如果y往下超出畫面下方，則進入「返回」模式
            this.goBack();
        }
    }
    private goBack() {
        this.removeUpdateFunctions();
        this.mode = 'back';
        this.game.app.ticker.add(this.backUpdate, this);
        // 魔王先跳回畫面上方
        this.y = -this.height;
    }
    private backUpdate(dt: number) {
        const target = this.posInFlock;
        // 將 y 以 1 的速率靠近 目標.y
        this.y = Math.min(target.y, this.y + 1 * dt);
        // 將 x 以 1 的速率靠近 目標.x
        if (this.x > target.x) {
            this.x = Math.max(target.x, this.x - 1 * dt);
        } else {
            this.x = Math.min(target.x, this.x + 1 * dt);
        }
        // 如果位置和目標完全一樣，那麼就回到idle模式
        if (target.equals(this.sprite.position)) {
            this.goIdle();
        }
    }
    /**
     * 改寫Invader的onFlockMove()
     */
    onFlockMove(moveX: number, moveY: number) {
        this.posInFlock.x += moveX;
        this.posInFlock.y += moveY;
        if (this.mode == 'idle') {
            this.x = this.posInFlock.x;
            this.y = this.posInFlock.y;
        }
    }
}
