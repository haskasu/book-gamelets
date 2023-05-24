import { IMediaInstance } from "@pixi/sound";
import { Application, Container, Graphics, Point, Rectangle } from "pixi.js";
import { Camera2D } from "../lib/camera/Camera2D";
import { keyboardManager } from "../lib/keyboard/KeyboardManager";
import { KeyCode } from "../lib/keyboard/KeyCode";
import { playSound } from "../lib/SoundUtils";
import { getStageSize, wait } from "../main";
import { Astroid } from "./Astroid";
import { Background } from "./Background";
import { Fighter } from "./Fighter";
import { Monster } from "./Monster";
import { SpaceObject } from "./SpaceObject";
import musicSnd from "../sounds/yemingkenoshisaido.mp3";
import { MonsterRaidersUI } from "./MonsterRaidersUI";
import { MonsterRaidersGameover } from "./MonsterRaidersGameover";

export class MonsterRaidersGame extends Container {
    // 裝所有太空物件的容器
    spaceRoot = new Container();

    objects: SpaceObject[] = [];

    camera: Camera2D;

    score = 0;

    music?: IMediaInstance;

    ui: MonsterRaidersUI;

    private static musicMuted = false;

    constructor(public app: Application) {
        super();
        app.stage.addChild(this);
        this.addChild(this.spaceRoot);
        this.spaceRoot.sortableChildren = true;
        this.createInitAstroids(4);
        let fighter = new Fighter(this, 320, 240);
        this.objects.push(fighter);
        // 建立攝影機
        this.camera = new Camera2D(app.ticker);
        this.camera.width = getStageSize().width;
        this.camera.height = getStageSize().height;
        this.camera.focus = fighter;
        this.camera.gameRoot = this.spaceRoot;
        // 開始定期製造小行星
        this.newAstroidLoop();
        // 建構星空背景
        new Background(this);
        // 開始定期製造怪獸
        this.newMonsterLoop();
        // 播放音樂
        this.playMusic();
        // 建構介面
        this.ui = new MonsterRaidersUI(this);
        this.addChild(this.ui);
    }
    /** 播放音樂 */
    async playMusic() {
        this.music = await playSound(musicSnd, {
            loop: true,
            muted: MonsterRaidersGame.musicMuted,
        });
        // 更新介面中的音樂按鈕
        this.ui.refreshMusicButton();
    }
    destroy() {
        super.destroy();
        this.camera.destroy();
        this.music && this.music.destroy();
    }
    /** 新增初始小行星群 */
    private createInitAstroids(amount: number) {
        // 取得畫面正中央的位置
        let center = new Point(
            getStageSize().width / 2,
            getStageSize().height / 2
        );
        // 跑迴圈，直到造出來的小行星數量等於amount
        let created = 0;
        while (created++ < amount) {
            // 隨機取得小行星距畫面中央的向量
            let vector = new Point(180 + Math.random() * 150);
            vector.rotate(Math.random() * Math.PI * 2);
            // 建立小行星
            let astroid = new Astroid(
                this,
                center.x + vector.x,
                center.y + vector.y
            );
            // 放進小行星陣列
            this.objects.push(astroid);
        }
    }
    /** 從畫面外圍矩形的邊上隨機取點 */
    randomPositionOnScreenEdge(padding: number): Point {
        // 計算全畫面的矩形
        const stage = this.app.stage;
        let screenWidth = getStageSize().width + stage.x * 2;
        let screenHeight = getStageSize().height + stage.y * 2;
        let rect = new Rectangle(
            this.camera.position.x - screenWidth / 2,
            this.camera.position.y - screenHeight / 2,
            screenWidth,
            screenHeight,
        );
        // 將矩形向四個方向擴展padding長度
        rect.pad(padding);
        // 開始決定小行星出生點，預設在隨機四個頂點之一
        let pos = new Point(
            Math.random() < 0.5 ? rect.x : rect.right,
            Math.random() < 0.5 ? rect.y : rect.bottom,
        );
        if (Math.random() < 0.5) {
            // 在橫邊上隨機移動
            pos.x = rect.x + rect.width * Math.random();
        } else {
            // 在豎邊上隨機移動
            pos.y = rect.y + rect.height * Math.random();
        }
        return pos;
    }
    /** 定時補充小行星 */
    async newAstroidLoop() {
        if (this.destroyed) {
            // 如果遊戲已被銷毀，就不要繼續
            return;
        }
        // 隨機選擇畫面外120個像素的一個位置
        let pos = this.randomPositionOnScreenEdge(120);
        // 建立小行星
        let astroid = new Astroid(this, pos.x, pos.y);
        // 延長小行星最短壽命
        astroid.minLifespan = 120;
        // 放進小行星陣列
        this.objects.push(astroid);
        // 等待
        await wait(12);
        // 呼叫自己，準備下一顆小行星的誕生
        this.newAstroidLoop();
    }
    /** 定時補充怪獸 */
    async newMonsterLoop() {
        if (this.destroyed) {
            // 如果遊戲已被銷毀，就不要繼續
            return;
        }
        // 隨機選擇畫面外40個像素的一個位置
        let pos = this.randomPositionOnScreenEdge(40);
        // 建立怪獸
        let monster = new Monster(this, pos.x, pos.y);
        // 放進陣列
        this.objects.push(monster);
        // 等待一秒
        await wait(60);
        // 呼叫自己，準備下一隻怪獸的誕生
        this.newMonsterLoop();
    }
    /** 增加分數 */
    addScore(value: number) {
        this.score += value;
        this.ui.setScore(this.score);
    }
    /** 遊戲結束 */
    gameover() {
        this.camera.focus = undefined;
        if (this.music) {
            this.music.volume = 0.1;
            MonsterRaidersGame.musicMuted = this.music.muted;
        }
        new MonsterRaidersGameover(this);
    }
    /** 測試攝影機 */
    testCamera() {
        // 製作攝影機的焦點，一個紅色的小圓
        let focus = new Graphics();
        focus.beginFill(0xFF0000);
        focus.drawCircle(0, 0, 10);
        focus.endFill();
        this.addChild(focus);
        // 將焦點物件放在畫面中央
        focus.x = getStageSize().width / 2;
        focus.y = getStageSize().height / 2;
        // 建立攝影機
        let camera = new Camera2D(this.app.ticker);
        camera.width = getStageSize().width;
        camera.height = getStageSize().height;
        camera.focus = focus;
        camera.gameRoot = this;
        // 用滑鼠控制焦點物件
        this.app.ticker.add(() => {
            if (keyboardManager.isKeyDown(KeyCode.LEFT)) {
                focus.x -= 1;
            }
            if (keyboardManager.isKeyDown(KeyCode.RIGHT)) {
                focus.x += 1;
            }
            if (keyboardManager.isKeyDown(KeyCode.UP)) {
                focus.y -= 1;
            }
            if (keyboardManager.isKeyDown(KeyCode.DOWN)) {
                focus.y += 1;
            }
        })
    }
}
