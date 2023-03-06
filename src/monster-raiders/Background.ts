import { Container, Texture, TilingSprite } from "pixi.js";
import { MonsterRaidersGame } from "./MonsterRaidersGame";
import { FullscreenArea, getStageSize, StageSizeEvents } from "../main";
import starrySpaceImg from "../images/starry-space.png";
import starsImg from "../images/stars.png";

export class Background extends Container {

    starrySprite: TilingSprite;

    starsSprite: TilingSprite;

    constructor(public game: MonsterRaidersGame) {
        super();
        // 黑底星空
        let texture = Texture.from(starrySpaceImg);
        this.starrySprite = new TilingSprite(
            texture,
            getStageSize().width,
            getStageSize().height
        );
        this.addChild(this.starrySprite);
        this.starrySprite.tileScale.set(0.5);
        // 星光圖
        this.starsSprite =  new TilingSprite(
            Texture.from(starsImg),
            getStageSize().width,
            getStageSize().height
        );
        this.addChild(this.starsSprite);
        this.starsSprite.tileScale.set(0.8);
        // 將Background加入遊戲容器的底層
        game.addChildAt(this, 0);
        // 開始更新循環
        game.app.ticker.add(this.update, this);
        // 初次更新背景尺寸
        this.refreshSize();
        // 監聽舞台改變事件，在舞台改變時更新背景尺寸
        StageSizeEvents.on('resize', this.refreshSize, this);
    }
    destroy(): void {
        super.destroy();
        this.game.app.ticker.remove(this.update, this);
        StageSizeEvents.off('resize', this.refreshSize, this);
    }
    update() {
        let camera = this.game.camera;
        // 以0.2的比例平移黑底星空的舖磚原點
        let shiftRate = 0.2;
        this.starrySprite.tilePosition.set(
            -camera.position.x * shiftRate,
            -camera.position.y * shiftRate
        );
        // 以0.5的比例平移星光圖的舖磚原點
        shiftRate = 0.25;
        this.starsSprite.tilePosition.set(
            -camera.position.x * shiftRate,
            -camera.position.y * shiftRate
        );
    }
    refreshSize() {
        this.position.x = FullscreenArea.x;
        this.position.y = FullscreenArea.y;
        // 黑底星空的尺寸更新
        this.starrySprite.width = FullscreenArea.width;
        this.starrySprite.height = FullscreenArea.height;
        // 星光圖的尺寸更新
        this.starsSprite.width = FullscreenArea.width;
        this.starsSprite.height = FullscreenArea.height;
    }
}
