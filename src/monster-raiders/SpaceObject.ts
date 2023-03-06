import { Container, Graphics, Point } from "pixi.js"
import { ArrayUtils } from "../lib/ArrayUtils";
import { MonsterRaidersGame } from "./MonsterRaidersGame";
/** 宣告SpaceObject為一個抽象類別 */
export abstract class SpaceObject extends Container {
    // 抽象地宣告type的getter函式
    abstract get type(): 'astroid' | 'fighter' | 'monster' | 'missile';
    // 移動速度
    velocity = new Point();
    // 最低壽命(ticks)
    minLifespan = 60;
    // 碰撞半徑
    hitRadius = 0;

    constructor(public game: MonsterRaidersGame, x: number, y: number) {
        super();
        this.position.set(x, y);
        game.spaceRoot.addChild(this);
        game.app.ticker.add(this.update, this);
        this.init();
    }
    protected init() {
        // 留給繼承的物件去做其他初始化的工作
    }
    destroy() {
        this.destroyed || super.destroy();
        this.game.app.ticker.remove(this.update, this);
        ArrayUtils.removeItem(this.game.objects, this);
    }
    update(dt: number) {
        // 依速度移動
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
        // 降底最低壽命
        this.minLifespan -= dt;
        // 如果最低壽命用完了且不在畫面上
        if (this.minLifespan < 0 && !this.isInScreen()) {
            // 自我銷毀
            this.destroy();
        }
    }
    isInScreen(): boolean {
        const screen = this.game.app.screen;
        return this.getBounds().intersects(screen);
    }
    /** 檢查碰撞 */
    hitTest(other: SpaceObject) {
        let distance = this.position.distanceTo(other.position);
        return distance < this.hitRadius + other.hitRadius;
    }
    /** 畫出碰撞半徑 */
    drawHitCircle(color = 0xFF0000) {
        let graphics = new Graphics();
        graphics.beginFill(color, 0.2);
        graphics.drawCircle(0, 0, this.hitRadius);
        graphics.endFill();
        this.addChild(graphics);
    }
}
