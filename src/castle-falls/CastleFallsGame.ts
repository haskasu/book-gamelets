import { Engine, Events, IEventCollision, Runner } from "matter-js";
import { Container, Sprite, Text } from "pixi.js";
import { CastleFalls } from "./CastleFalls";
import bgImg from "../images/castle-gamebg.png";
import { ICastleFallsLevelData, ICFObject } from "./CastleFallsLevelData";
import { Slingshot } from "./Slingshot";
import { MatterRender } from "../lib/matter/MatterRender";
import { getStageSize, StageSizeEvents, wait, waitForTween } from "../main";
import { MatterObject } from "./MatterObject";
import { Easing, Tween } from "@tweenjs/tween.js";

export class CastleFallsGame extends Container {

    engine = Engine.create({ enableSleeping: true });
    runner = Runner.create();
    matterRender: MatterRender;
    // 用來儲存建立好的物件
    objects: { [key: string]: MatterObject } = {};

    constructor(public gameApp: CastleFalls, public level: number) {
        super();
        // 我們將用zIndex來安排pixi繪圖物件的層級
        this.sortableChildren = true;
        // 加入背景圖
        this.addBackground();
        // 建立matter.js除錯用的繪圖器
        this.matterRender = new MatterRender(
            this.engine,
            this.gameApp.app.stage,
            getStageSize()
        );
        StageSizeEvents.on('resize', this.matterRender.align);
        // 啟動遊戲的一連串動作
        this.loadAndStartLevel(level);
        // 監聽碰撞事件
        this.setupCollisionListener();
    }
    destroy() {
        super.destroy();
        StageSizeEvents.off('resize', this.matterRender.align);
        this.matterRender.destroy();
        Runner.stop(this.runner);
    }
    // 方便遊戲中取用Pixi的app
    get app() {
        return this.gameApp.app;
    }
    addBackground() {
        var bg = Sprite.from(bgImg);
        bg.zIndex = 0;
        this.addChild(bg);
    }
    async loadAndStartLevel(level: number) {
        // 戴入關卡資料 => data
        let data = await this.loadLevel(level);
        // 建立關卡世界
        this.buildLevel(data);
        // 遊戲開始
        this.start();
    }
    async loadLevel(level: number) {
        let baseUrl = import.meta.env.BASE_URL;
        let url = `castle-falls/level_${level}.json`;
        url = baseUrl + url + '?time=' + Date.now();
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }
    buildLevel(data: ICastleFallsLevelData) {
        // 依資料建構這一關的世界
        for (let objData of data.objects) {
            this.createMatterObject(objData);
        }
        new Slingshot(this, data.slingshot);
    }
    // 建立MatterObject，並儲存起來
    createMatterObject(objData: ICFObject): MatterObject {
        let obj = new MatterObject(this, objData);
        this.objects[obj.body.id] = obj;
        return obj;
    }
    start() {
        // 讓引擎開始跑
        Runner.run(this.runner, this.engine);
    }
    // 等待所有物體都睡著
    async waitWorldPeace() {
        // 尋找一個沒睡著的物體
        let awaked = this.engine.world.bodies.find(body => {
            return !body.isSleeping;
        });
        if (awaked) {
            // 如果找到了，就先等一個tick，然後再呼叫自己一次
            await wait(1);
            await this.waitWorldPeace();
        }
    }
    private setupCollisionListener(): void {
        Events.on(
            this.engine,
            'collisionActive',
            (event: IEventCollision<Engine>) => {
                // 取得碰撞事件中一對一對的物體
                for (let pair of event.pairs) {
                    //console.log(`--撞碰事件--`);
                    const objA = pair.bodyA;
                    const objB = pair.bodyB;
                    const maObjA = this.objects[objA.id];
                    const maObjB = this.objects[objB.id];
                    // 呼叫各自的受撞函式，並以對方作為參數
                    maObjA.onCollisionActive(maObjB, pair);
                    maObjB.onCollisionActive(maObjA, pair);
                }
            });
    }
    async gameover() {
        // 儲存遊戲進度
        this.gameApp.record.setLevelRecord(
            this.level,
            {
                cleared: true
            }
        );
        // 取得遊戲舞台尺寸
        const stageSize = getStageSize();
        // 建立過關文字
        let text = new Text("The Castle has Fallen", {
            fontSize: 32,
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 5,
        });
        // 調整軸心至文字中央的底部
        text.pivot.set(text.width / 2, text.height / 2);
        // 移動文字至畫面中心
        text.position.set(stageSize.width / 2, stageSize.height / 2);
        // 拉高顯示圖層
        text.zIndex = 100;
        // 加入遊戲容器
        this.addChild(text);
        // 先將文字縮小至0.1
        text.scale.set(0.1);
        // 利用Tween，在兩秒內放大至原尺寸
        let tween = new Tween(text.scale)
            .to({ x: 1, y: 1 }, 2000)
            .easing(Easing.Elastic.Out)
            .start();
        // 等待Tween動畫完成
        await waitForTween(tween);
        // 等待180個ticks(約三秒)
        await wait(180);
        // 銷毀遊戲
        this.destroy();
        // 重新打開選關畫面
        this.gameApp.openLevelsUI();
    }
}
