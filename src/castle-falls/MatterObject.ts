import { Bodies, Body, Composite, Events, Pair, Vector } from "matter-js";
import { Container, Sprite, TilingSprite } from "pixi.js";
import { CastleFallsGame } from "./CastleFallsGame";
import { BodyOptionsMap, ICFObject } from "./CastleFallsLevelData";
import groundImg from "../images/castle-ground.png";
import brickImg from "../images/castle-brick.png";
import woodImg from "../images/castle-wood.png";
import bossImg from "../images/castle-boss.png";
import rockImg from "../images/castle-rock.png";
import poofGif from "../images/poof.gif";
import { gifFrom } from "../lib/PixiGifUtils";

export class MatterObject extends Container {

    type: string;   // 物體類別

    body: Body;     // Matter.js剛體

    sprite: Sprite; // PIXI精靈圖

    constructor(public game: CastleFallsGame, public data: ICFObject) {
        super();
        // 將物體類別記錄下來
        this.type = data.type;
        // 建立剛體並加入物理世界中
        this.body = this.createBody(data);
        Composite.add(game.engine.world, this.body);
        // 建立精靈圖、加入這個繪圖容器、並放進遊戲容器
        this.sprite = this.createSprite(data);
        this.addChild(this.sprite);
        game.addChild(this);
        // 監聽物理引擎發出的更新後事件
        Events.on(game.engine, 'afterUpdate', this.update);
    }
    destroy() {
        // 銷毀繪圖器
        super.destroy();
        // 移除剛體
        Composite.remove(this.game.engine.world, this.body);
        // 取消監聽
        Events.off(this.game.engine, 'afterUpdate', this.update);
        // 刪除遊戲中儲存物件的備份
        delete this.game.objects[this.body.id];
    }

    private createBody(data: ICFObject): Body {
        // 依物體類別取得定義好的物理性質
        let bodyOptions = BodyOptionsMap[data.type];
        if (!bodyOptions) {
            throw new Error("BodyOptions not defined: " + data.type);
        }
        // 取得data裏的物體角度，如果沒定義則取0
        let angleDeg = data.angleDeg || 0;
        // 將角度換算為弧度，再放進創造剛體的物理性質裏
        bodyOptions.angle = angleDeg / 180 * Math.PI;
        if (data.circle) {
            // 如果物體有circle資料，則創造圓形剛體
            return Bodies.circle(
                data.x,
                data.y,
                data.circle.radius,
                bodyOptions,
                24
            );
        } else if (data.rect) {
            // 如果物體有rect資料，則創造矩形剛體
            return Bodies.rectangle(
                data.x,
                data.y,
                data.rect.width,
                data.rect.height,
                bodyOptions,
            );
        } else {
            // 如果沒有circle也不是rect，則丟出錯誤
            throw new Error('Unknown body shape.');
        }
    }
    private createSprite(data: ICFObject): Sprite {
        if (data.type == 'ground') {
            const rect = data.rect!;
            let sprite = TilingSprite.from(
                groundImg,
                { width: rect.width, height: rect.height }
            );
            sprite.pivot.set(sprite.width / 2, sprite.height / 2);
            sprite.width = rect.width;
            sprite.height = rect.height;
            this.zIndex = 2;
            return sprite;
        }
        if (data.type == 'brick') {
            const rect = data.rect!;
            let sprite = Sprite.from(brickImg);
            sprite.pivot.set(42, 21);
            sprite.width = rect.width;
            sprite.height = rect.height;
            this.zIndex = 5;
            return sprite;
        }
        if (data.type == 'wood') {
            const rect = data.rect!;
            let sprite = Sprite.from(woodImg);
            sprite.pivot.set(42, 21);
            sprite.width = rect.width;
            sprite.height = rect.height;
            this.zIndex = 4;
            return sprite;
        }
        if (data.type == 'boss') {
            const circle = data.circle!;
            let sprite = Sprite.from(bossImg);
            sprite.pivot.set(36, 48);
            sprite.scale.set(circle.radius / 32);
            this.zIndex = 3;
            return sprite;
        }
        if (data.type == 'rock') {
            const circle = data.circle!;
            let sprite = Sprite.from(rockImg);
            sprite.pivot.set(38, 36);
            sprite.scale.set(circle.radius / 36);
            this.zIndex = 6;
            return sprite;
        }
        return new Sprite();
    }

    private update = () => {
        this.position.copyFrom(this.body.position);
        this.rotation = this.body.angle;
    }

    onCollisionActive(_other: MatterObject, pair: Pair) {
        // 處理碰撞
        //console.log(this.type + " 撞到了 " + other.type);
        if (this.type == 'boss') {
            let impulse = 0;
            for (let contact of pair.activeContacts) {
                impulse += Math.abs(contact.normalImpulse);
            }
            if (impulse > 50) {
                // 魔王自我銷毀/播放動畫/遊戲結束
                this.destroy();
                this.playPoofGif(this.body.position);
                this.game.gameover();
            }
        }
    }

    private async playPoofGif(position: Vector) {
        // 自動播放poof.gif動畫，並在播放結束時自我銷毀
        let gif = await gifFrom(poofGif, {
            animationSpeed: 2,
            loop: false,
            autoPlay: true,
            onComplete: () => {
                gif.destroy();
            }
        });
        // 調整軸心到動畫的中心點
        gif.pivot.set(gif.width / 2, gif.height / 2);
        // 將動畫縮小一點
        gif.scale.set(0.6);
        // 移動至參數指定的位置
        gif.position.copyFrom(position);
        // 圖層調高，才不會被其它物件遮住
        gif.zIndex = 10;
        // 將動畫放到遊戲容器裏
        this.game.addChild(gif);
    }
}
