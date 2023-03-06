import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import invadersImage from '../images/invaders.png';
import { wait } from "../main";
import { playSound } from "../lib/SoundUtils";
import invaderKilledSnd from '../sounds/invaderKilled.wav';

export class Invader {
    // 外星人的圖
    sprite = new Sprite();

    constructor(
        public game: SpaceInvadersGame,
        x: number,    // 初始位置 x
        y: number,    // 初始位置 y
        type: number, // 造型(0,1,2,3)
    ) {
        // 載入圖片
        let baseTexture = BaseTexture.from(invadersImage);
        // 建立材質
        let imageRect = new Rectangle(50 * type, 0, 50, 34);
        let texture = new Texture(baseTexture, imageRect);
        // 指定精靈圖的材質
        this.sprite.texture = texture;
        // 把精靈圖放到舞台上
        game.app.stage.addChild(this.sprite);
        // 移到初始位置
        this.sprite.position.set(x, y);
        // 依流程調整圖片軸心
        if (baseTexture.valid) {
            this.adjustPivot();
        } else {
            baseTexture.once('loaded', () => {
                this.adjustPivot();
            });
        }
    }

    destroy() {
        this.sprite.destroy();
    }
    /**
     * 調整圖片的軸心位置(置中)
     */
    private adjustPivot() {
        this.sprite.pivot.set(
            this.sprite.width / 2,
            this.sprite.height / 2
        );
    }

    get x(): number {
        return this.sprite.x;
    }
    set x(value: number) {
        this.sprite.x = value;
    }

    get y(): number {
        return this.sprite.y;
    }
    set y(value: number) {
        this.sprite.y = value;
    }

    get width(): number {
        return this.sprite.width;
    }
    get height(): number {
        return this.sprite.height;
    }
    get destroyed(): boolean {
        return this.sprite.destroyed;
    }
    /**
     * 當外星人群體要移動時呼叫的函式
     */
    onFlockMove(moveX: number, moveY: number) {
        this.x += moveX;
        this.y += moveY;
    }
    /**
     * 外星人毀滅時的動畫與程序
     */
    async hitAndDead() {
        playSound(invaderKilledSnd, { volume: 0.2 });
        // 改變材質在基礎材質上的矩形(換成最右側的50x34)
        const texture = this.sprite.texture;
        texture.frame = new Rectangle(200, 0, 50, 34);
        await wait(10);
        this.destroy();
    }
}
