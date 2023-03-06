import { SpaceObject } from "./SpaceObject";
import { Sprite } from "pixi.js";
import missileImg from "../images/missile.png";
import { Explosion } from "./Explosion";

export class Missile extends SpaceObject {

    get type(): 'astroid' | 'fighter' | 'monster' | 'missile' {
        return 'missile';
    }

    protected init(): void {
        // 飛彈的圖
        let sprite = Sprite.from(missileImg);
        sprite.pivot.set(15, 4);
        this.addChild(sprite);
        // 縮小一點
        sprite.scale.set(0.5);
        // 排序值
        this.zIndex = 3;
        // 設定碰撞半徑
        this.hitRadius = 5;
    }
    setDirection(rotation: number) {
        this.rotation = rotation;
        this.velocity.x = 8;
        this.velocity.rotate(rotation);
    }
    /** 檢測與所有能與飛彈相撞的太空物件 */
    hitTestSpaceObject() {
        return this.game.objects.find((obj) => {
            const isCollidable = (
                obj.type == 'astroid' ||
                obj.type == 'monster'
            );
            return isCollidable && obj.hitTest(this);
        })
    }
    update(dt: number) {
        let hitObject = this.hitTestSpaceObject();
        if (hitObject) {
            // 撞到東西了，準備自爆
            if (hitObject.type == 'monster') {
                new Explosion().playAndDestroy(hitObject);
                hitObject.destroy();
                this.game.addScore(1);
            } else {
                new Explosion().playAndDestroy(this);
            }
            this.destroy();
            return;
        }
        super.update(dt);
    }
}
