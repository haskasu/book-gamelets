import { SpaceObject } from "./SpaceObject";
import { Sprite } from "pixi.js";
import astroidImg from '../images/astroid.png';

export class Astroid extends SpaceObject {

    get type(): 'astroid' | 'fighter' | 'monster' {
        return 'astroid';
    }

    protected init(): void {
        // 放一張小行星的圖，並移動軸心到中心
        let sprite = Sprite.from(astroidImg);
        sprite.pivot.set(130, 120);
        this.addChild(sprite);
        // 隨機旋轉一個角度，讓每顆小行星看起來不一樣
        sprite.rotation = Math.random() * Math.PI * 2;
        // 隨機縮放比例
        sprite.scale.set(0.3 + Math.random() * 0.5);
        // 隨機指定排序值在2到3之間
        this.zIndex = 2 + Math.random();
        // 隨機選擇移動速度
        this.velocity.x = Math.random() * 0.3;
        // 隨機旋轉移動方向
        this.velocity.rotate(Math.random() * Math.PI * 2);
        // 計算碰撞半徑
        this.hitRadius = sprite.scale.x * 110;
        // 畫出碰撞圓
        // this.drawHitCircle();
    }
    // 小行星自轉速度
    private rotateSpeed = (Math.random() - 0.5) * 0.004;
    // 覆寫SpaceObject的update()
    update(dt: number) {
        this.rotation += this.rotateSpeed * dt;
        super.update(dt);
    }
}
