import { SpaceObject } from "./SpaceObject";
import fighterImg from "../images/space-fighter.gif";
import { gifFrom } from "../lib/PixiGifUtils";
import { AnimatedGIF } from "@pixi/gif";
import { mouseGlobal } from "../lib/PixiMouseUtils";
import { Explosion } from "./Explosion";
import { Missile } from "./Missile";
import missileSnd from "../sounds/missile-launch.mp3";
import { playSound } from "../lib/SoundUtils";

export class Fighter extends SpaceObject {

    get type(): 'astroid' | 'fighter' | 'monster' | 'missile' {
        return 'fighter';
    }

    protected init() {
        this.zIndex = 4;
        this.loadFighterGIF();
        this.hitRadius = 16;
        // this.drawHitCircle();
        // 監聽滑鼠左鍵事件
        const stage = this.game.app.stage;
        stage.on('pointerdown', this.launchMissile, this);
    }
    destroy(): void {
        super.destroy();
        const stage = this.game.app.stage;
        stage.off('pointerdown', this.launchMissile, this);
    }

    // 戰機的GIF繪圖器
    private gif?: AnimatedGIF;
    // 載入GIF並建構GIF繪圖器
    private async loadFighterGIF() {
        // 建立gif動畫繪圖器
        let gif = await gifFrom(fighterImg, {
            animationSpeed: 0.5,
        });
        this.gif = gif;
        // 把動畫加到戰機容器
        this.addChild(gif);
        // 調整gif的軸心位置
        gif.pivot.set(49, 49);
        // 將圖案縮小一點
        gif.scale.set(0.5);
    }

    update(dt: number) {
        let hitObject = this.hitTestSpaceObject();
        if (hitObject) {
            // 撞到東西了，準備自爆
            new Explosion().playAndDestroy(this);
            this.destroy();
            this.game.gameover();
            return;
        }
        if (this.gif) {
            // 轉向滑鼠
            let facing = this.toLocal(mouseGlobal);
            const rotation = Math.atan2(facing.y, facing.x);
            this.gif.rotation = rotation;
            // 更新速度向量
            this.velocity.set(2, 0);
            this.velocity.rotate(rotation);
        }
        super.update(dt);
    }
    /** 檢測與所有能撞毀戰機太空物件的碰撞 */
    hitTestSpaceObject() {
        return this.game.objects.find((obj) => {
            const isCollidable = (
                obj.type == 'astroid' ||
                obj.type == 'monster'
            );
            return isCollidable && obj.hitTest(this);
        })
    }
    /** 發射飛彈 */
    launchMissile() {
        if (this.gif) {
            let missile = new Missile(this.game, this.x, this.y);
            missile.setDirection(this.gif.rotation);
            // 發射飛彈的音效
            playSound(missileSnd);
        }
    }
}
