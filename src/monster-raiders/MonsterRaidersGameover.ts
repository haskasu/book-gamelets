import { Container, Graphics, Text } from "pixi.js";
import { getStageSize } from "../main";
import { MonsterRaidersGame } from "./MonsterRaidersGame";

export class MonsterRaidersGameover extends Container {

    constructor(public game: MonsterRaidersGame) {
        super();
        // 視窗的背景
        this.drawBackground(480, 240);
        // 寫上遊戲結束的字樣
        this.drawGameoverText(20);
        // 寫上最後得分
        this.drawScoreText(100);
        // 加上重玩的按鈕
        this.createRestartButton(160);
        // 把自己加進遊戲容器
        game.addChild(this);
        // 視窗置中
        this.position.set(
            (getStageSize().width - this.width) / 2,
            (getStageSize().height - this.height) / 2
        );
    }
    drawBackground(width: number, height: number) {
        let graphics = new Graphics();
        graphics.beginFill(0xFFFFFF, 0.5);
        graphics.drawRoundedRect(0, 0, width, height, 10);
        graphics.endFill();
        this.addChild(graphics);
    }
    drawGameoverText(y: number) {
        let gameoverTxt = new Text('GAME OVER', {
            fontFamily: 'SpaceInvadersFont',
            fontSize: 64,
            fill: 0x990000,
        });
        gameoverTxt.resolution = 2;
        gameoverTxt.position.set(
            (this.width - gameoverTxt.width) / 2,
            y
        );
        this.addChild(gameoverTxt);
    }
    drawScoreText(y: number) {
        let score = this.game.score.toLocaleString();
        let scoreTxt = new Text('SCORE ' + score, {
            fontFamily: 'SpaceInvadersFont',
            fontSize: 32,
            fill: 0x006600,
        });
        scoreTxt.resolution = 2;
        scoreTxt.position.set(
            (this.width - scoreTxt.width) / 2,
            y
        );
        this.addChild(scoreTxt);
    }
    createRestartButton(y: number) {
        // 先建立整個按鈕的容器
        let button = new Container();
        // 幫按鈕加上圓角方形的背景
        let bg = new Graphics();
        bg.beginFill(0xFFFFFF);
        bg.drawRoundedRect(0, 0, 240, 48, 24);
        bg.endFill();
        // 預設的按鈕背景底色
        bg.tint = 0x283593;
        button.addChild(bg);
        // 加再上重玩一次的按鈕標籤
        let label = new Text('Restart', {
            fontFamily: 'SpaceInvadersFont',
            fontSize: 36,
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
            (this.width - button.width) / 2,
            y
        );
        // 加入對話框容器
        this.addChild(button);
        // 監聽滑鼠事件
        button.on('click', () => {
            this.game.destroy();
            new MonsterRaidersGame(this.game.app);
        });
        button.on('pointerover', () => {
            bg.tint = 0x3F51B5;
        });
        button.on('pointerout', () => {
            bg.tint = 0x283593;
        });
        // 手機的觸碰結束事件
        button.on('touchend', (event) => {
            button.emit('click', event);
        });
    }
}
