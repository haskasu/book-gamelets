import { Application, Container, Graphics, Text } from "pixi.js";
import { CastleFalls } from "./castle-falls/CastleFalls";
import { getStageSize } from "./main";
import { MonsterRaidersGame } from "./monster-raiders/MonsterRaidersGame";
import { SpaceInvadersGame } from "./space-invaders/SpaceInvadersGame";
import { TreeGenerator } from "./tree-generator/TreeGenerator";

export class GameLauncher extends Container {

    constructor(public app: Application) {
        super();
        // 加入Pixi舞台
        app.stage.addChild(this);
        // 建立遊戲按鈕
        this.createButton('小樹枝上開朵花', 80, () => {
            new TreeGenerator(app);
        });
        this.createButton('經典小密蜂', 160, () => {
            new SpaceInvadersGame(app);
        });
        this.createButton('怪獸掃蕩隊', 240, () => {
            new MonsterRaidersGame(app);
        });
        this.createButton('魔王城的隕落', 320, () => {
            new CastleFalls(app);
        });
    }
    /** 建構進入遊戲的按鈕 */
    createButton(name: string, y: number, onClick: () => void) {
        // 先建立整個按鈕的容器
        let button = new Container();
        this.addChild(button);
        // 幫按鈕加上圓角方形的背景
        let bg = new Graphics();
        bg.beginFill(0xFFFFFF);
        bg.drawRoundedRect(0, 0, 480, 48, 24);
        bg.endFill();
        // 預設的按鈕背景底色
        bg.tint = 0x666666;
        button.addChild(bg);
        // 加再上遊戲名字作為按鈕標籤
        let label = new Text(name, {
            fontSize: 32,
            fill: 0xFFFFFF,
        });
        label.resolution = 2;
        label.position.set(
            (bg.width - label.width) / 2,
            (bg.height - label.height) / 2
        );
        button.addChild(label);
        // 設定按鈕和互動相關的屬性
        button.interactive = true;
        button.cursor = 'pointer';
        // 在對話框內置中
        button.position.set(
            (getStageSize().width - button.width) / 2,
            y
        );
        // 監聽滑鼠事件
        button.on('click', () => {
            this.destroy();
            onClick();
        });
        button.on('pointerover', () => {
            bg.tint = 0x3F51B5;
        });
        button.on('pointerout', () => {
            bg.tint = 0x666666;
        });
    }
}
