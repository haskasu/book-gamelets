import { MonsterRaidersGame } from "./MonsterRaidersGame";
import { BaseTexture, Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { FullscreenArea, getStageSize, StageSizeEvents } from "../main";
import musicNotesImg from "../images/music-notes.png";

export class MonsterRaidersUI extends Container {

    scoreText?: Text;

    musicButton?: Sprite;

    refreshMusicButton = () => { };

    constructor(public game: MonsterRaidersGame) {
        super();
        this.createScoreText();
        this.createMusicButton();
        this.updateTop();
        StageSizeEvents.on('resize', this.updateTop, this);
    }
    destroy() {
        super.destroy();
        StageSizeEvents.off('resize', this.updateTop, this);
    }
    /** 調整介面頂端位置 */
    private updateTop() {
        this.y = FullscreenArea.y;
    }
    private async createScoreText() {
        // 等待字型載入完畢
        await document.fonts.load('10px SpaceInvadersFont');
        // 畫分數文字的背景
        let graphics = new Graphics();
        graphics.beginFill(0x666666, 0.5);
        graphics.drawRoundedRect(-50, 0, 100, 28, 14);
        graphics.endFill();
        graphics.position.set(getStageSize().width / 2, 10);
        this.addChild(graphics);
        // 新增分數文字
        this.scoreText = new Text('', {
            fontFamily: 'SpaceInvadersFont',
            fontSize: 24,
            fill: 0xFFFFFF,
        });
        this.scoreText.y = 12;
        this.addChild(this.scoreText);
        // 更新分數文字
        this.setScore(this.game.score);
    }
    private async createMusicButton() {
        // 準備音樂開與關的兩個圖示材質
        let baseTexture = BaseTexture.from(musicNotesImg);
        let musicOnTexture = new Texture(
            baseTexture,
            new Rectangle(0, 0, 64, 64)
        );
        let musicOffTexture = new Texture(
            baseTexture,
            new Rectangle(64, 0, 64, 64)
        );
        // 建構按鈕的繪圖器（精靈圖）
        let button = new Sprite();
        button.position.set(getStageSize().width - 36, 12);
        button.scale.set(0.4);
        button.interactive = true;
        button.cursor = 'pointer';
        this.addChild(button);
        // 更新按鈕圖案的函式
        let refreshButton = () => {
            let music = this.game.music;
            if (music && music.muted) {
                button.texture = musicOffTexture;
            } else {
                button.texture = musicOnTexture;
            }
        };
        // 將區域函式抓出來給類別屬性
        this.refreshMusicButton = refreshButton;
        refreshButton();
        // 監聽按鈕事件
        button.on('click', () => {
            let music = this.game.music;
            if (music) {
                music.muted = !music.muted;
                refreshButton();
            }
        });
        // 手機的觸碰結束事件
        button.on('touchend', (event) => {
            button.emit('click', event);
        });
    }

    public setScore(score: number) {
        const scoreTxt = this.scoreText;
        if (scoreTxt) {
            scoreTxt.text = score.toLocaleString();
            // 置中
            scoreTxt.x = (getStageSize().width - scoreTxt.width) / 2;
        }
    }
}
