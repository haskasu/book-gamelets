import { AnimatedSprite, BaseTexture, Container, Rectangle, Texture } from "pixi.js";
import { SpaceObject } from "./SpaceObject";
import explosionImg from "../images/explosion-spritesheet.png";
import fighterExplodeSnd from "../sounds/fighter-explode.mp3";
import monsterExplodeSnd from "../sounds/monster-explode.mp3";
import missileExplodeSnd from "../sounds/missile-explode.mp3";
import { playSound } from "../lib/SoundUtils";

export class Explosion extends Container {

    animation: AnimatedSprite;

    constructor() {
        super();
        // 排序值要大於其他所有太空物件
        this.zIndex = 10;
        // 建構爆炸動畫
        this.animation = new AnimatedSprite(getTextures());
        // 調整動畫的軸心至圖片中央
        this.animation.pivot.set(
            frameSize.width / 2,
            frameSize.height / 2
        );
        // 不重覆播放動畫
        this.animation.loop = false;
        // 加進爆炸的繪圖容器
        this.addChild(this.animation);
    }
    /** 播放動畫，並在結束時自我銷毀 */
    playAndDestroy(target: SpaceObject) {
        // 加入遊戲容器
        target.game.spaceRoot.addChild(this);
        // 將位置移到發生爆炸的太空物件
        this.position.copyFrom(target.position);
        // 依爆炸物件的碰撞半徑調整特效大小
        this.animation.scale.set(target.hitRadius / 32);
        // 播放動畫
        this.animation.play();
        // 在動畫播放結束時，自我銷毀
        this.animation.onComplete = () => this.destroy();
        // 依太空物件的種類播放不同的音效
        if (target.type == 'fighter') {
            playSound(fighterExplodeSnd);
        } else if (target.type == 'monster') {
            playSound(monsterExplodeSnd);
        } else {
            playSound(missileExplodeSnd);
        }
    }
}
// 爆炸動畫中每一幀的長寬尺寸
const frameSize = {
    width: 128,
    height: 124,
}
// 爆炸動畫材質陣列的快取
const texturesCache: Texture[] = [];
// 取得爆炸動畫所有材質的函式
function getTextures(): Texture[] {
    // 若快取是空的，就要建立材質陣列的快取
    if (texturesCache.length == 0) {
        // 載入基底材質
        let baseTexture = BaseTexture.from(explosionImg);
        // 組建48張不同部位的材質
        for (let i = 0; i < 48; i++) {
            let col = i % 8;
            let row = Math.floor(i / 8);
            let frame = new Rectangle(
                col * frameSize.width,
                row * frameSize.height,
                frameSize.width,
                frameSize.height
            );
            let texture = new Texture(baseTexture, frame);
            texturesCache.push(texture);
        }
    }
    // 回傳材質陣列的快取
    return texturesCache;
}