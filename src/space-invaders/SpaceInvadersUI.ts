import { BaseTexture, Container, Sprite, Text } from "pixi.js";
import cannonImage from '../images/cannon.png';
import { getStageSize, wait } from "../main";

export class SpaceInvadersUI extends Container {
    // 遊戲會用到的兩個屬性
    private score = 0;
    private scoreText?: Text;
    // 砲台生命數
    private lives = 3;
    // 砲台生命圖的陣列
    private liveSprites: Sprite[] = [];
    // 關卡文字繪圖器
    private levelText?: Text;

    constructor() {
        super();
        this.loadUI();
    }
    private async loadUI() {
        // 等待字型載入完畢
        await document.fonts.load('10px SpaceInvadersFont');
        this.createText('SCORE', '#FFFFFF', 30, 10);
        this.createText('LIVES', '#FFFFFF', 430, 10);
        // 顯示分數的繪圖器
        this.scoreText = this.createText(
            this.score.toLocaleString(),
            '#00FF00',
            110,
            10
        );
        this.setLives(this.lives);
    }
    /** 方便新增文字繪圖器的函式 */
    private createText(label: string, color: string, x: number, y: number) {
        // 新增Pixi提供的Text物件
        let text = new Text(label, {
            fontFamily: '"SpaceInvadersFont"',
            fontSize: 24,
            fill: color,
        });
        // 提高文字的解析度
        text.resolution = 2;
        // 放至指定位置
        text.position.set(x, y);
        // 將文字繪圖器加入UI容器
        this.addChild(text);
        return text;
    }
    /**
     * 改變分數
     */
    addScore(score: number) {
        this.score += score;
        if (this.scoreText) {
            this.scoreText.text = this.score.toLocaleString();
        }
    }
    /**
     * 取得分數
     */
    getScore() {
        return this.score;
    }
    /**
     * 更新砲台生命數
     */
    setLives(lives: number) {
        // 更新生命數
        this.lives = lives;
        // 將多餘的砲台生命圖清掉
        while (this.liveSprites.length > this.lives) {
            let sprite = this.liveSprites.pop();
            sprite?.destroy();
        }
        // 準備砲台的材質基底備用
        let baseTexture = BaseTexture.from(cannonImage);
        // 補足不夠的砲台生命圖
        while (this.liveSprites.length < this.lives) {
            // 下一個生命圖的index
            let index = this.liveSprites.length;
            // 新增精靈圖、設位置並縮小、加入UI容器
            let sprite = Sprite.from(baseTexture);
            sprite.position.set(510 + index * 42, 11);
            sprite.scale.set(0.6);
            this.addChild(sprite);
            // 將新增的精靈圖加入生命圖陣列
            this.liveSprites.push(sprite);
        }
    }
    /**
     * 取得砲台生命數
     */
    getLives() {
        return this.lives;
    }
    /**
     * 顯示目前關卡
     */
    async showLevel(level: number) {
        // 等待字型載入完畢
        await document.fonts.load('10px SpaceInvadersFont');

        let levelText = this.levelText;
        // 如果levelText是空的，先建立Text繪圖器
        if (!levelText) {
            levelText = this.createText('', '#FFFFFF', 250, 10);
            this.addChild(levelText);
            this.levelText = levelText;
        }
        levelText.text = 'LEVEL ' + level;
        // 用大字在畫面中央顯示關卡開始的動畫
        let text = this.createText('LEVEL ' + level, '#FFFFFF', 0, 200);
        // 超大字
        text.style.fontSize = 48;
        // 左右置中
        text.x = (getStageSize().width - text.width) / 2;
        // 等待兩秒
        await wait(120);
        // 換字
        text.text = 'START';
        // 左右置中
        text.x = (getStageSize().width - text.width) / 2;
        // 等待一秒
        await wait(60);
        // 銷毀大字
        text.destroy();
    }
}
