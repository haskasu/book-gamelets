import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import invadersImage from '../images/invaders.png';

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
        // 新增精靈圖
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
}
