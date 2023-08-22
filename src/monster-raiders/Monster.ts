import { SpaceObject } from "./SpaceObject";
import { Sprite } from "pixi.js";
import monsterImg from "../images/space-monster.png";
import { MathUtils } from "../lib/MathUtils";

export class Monster extends SpaceObject {

    get type(): 'astroid' | 'fighter' | 'monster' | 'missile' {
        return 'monster';
    }
    // 還要追著玩家跑多久
    followDuration = 200;

    protected init(): void {
        // 放上怪獸的圖
        let sprite = Sprite.from(monsterImg);
        sprite.pivot.set(56, 66);
        this.addChild(sprite);
        // 縮小一點
        sprite.scale.set(0.66);
        // 隨機旋轉一個角度，作為怪獸初始的飛行方向
        this.rotation = Math.random() * Math.PI * 2;
        // 隨機指定排序值在2到3之間，讓怪獸穿梭在小行星之間
        this.zIndex = 2 + Math.random();
        // 初始化飛行速度的向量
        this.velocity.x = 2.1;
        this.velocity.rotate(this.rotation);
        // 設定碰撞半徑
        this.hitRadius = 20;
        // 畫出碰撞圓
        //this.drawHitCircle();
    }

    update(dt: number) {
        // 先找到玩家戰機
        let fighter = this.game.objects.find(obj => {
            return obj.type == 'fighter';
        });
        if (fighter && this.followDuration > 0) {
            // 縮短追蹤玩家的時間
            this.followDuration -= dt;
            // 計算兩物件之間的向量
            let vector = fighter.position.sub(this.position);
            // 計算戰機對於我的方向(弧度)
            let radians = Math.atan2(vector.y, vector.x);
            // 計算和我目前的方向差
            let radDiff = radians - this.rotation;
            radDiff = MathUtils.normalizeRadians(radDiff);
            // 依弧度差來轉向
            const rotateSpeed = 0.025;
            if (radDiff > 0) {
                let rad = Math.min(radDiff, rotateSpeed * dt);
                this.rotation += rad;
            } else {
                let rad = Math.max(radDiff, -rotateSpeed * dt);
                this.rotation += rad;
            }
            // 依新的面向調整飛行速度的向量
            this.velocity.set(2.1, 0);
            this.velocity.rotate(this.rotation);
        }
        super.update(dt);
    }
}
