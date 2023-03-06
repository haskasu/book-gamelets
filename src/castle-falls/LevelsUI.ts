import { CastleFalls } from "./CastleFalls";
import { Container, Sprite } from "pixi.js";
import castleBgImg from "../images/castle-bg.jpg";
import { PixiButton } from "../lib/PixiButton";

export class LevelsUI extends Container {

    constructor(public gameApp: CastleFalls) {
        super();
        // 加入介面背景圖
        let bg = Sprite.from(castleBgImg);
        bg.scale.set(0.5);
        this.addChild(bg);
        // 建構選關按鈕
        const maxLevel = 3;
        for (let lv = 1; lv <= maxLevel; lv++) {
            let button = this.createLevelButton(lv);
            if (!gameApp.record.isLevelUnlocked(lv)) {
                button.interactive = false;
                button.alpha = 0.5;
            }
        }
    }
    // 建立一個關卡的選擇按鈕
    private createLevelButton(level: number) {
        // 按鈕標籤
        let label = `第${level}關`;
        // 建立按鈕
        let button = new PixiButton({
            width: 240,
            height: 36,
            cornerRadius: 8,
            backgroundColor: {
                default: 0x333333,
                hover: 0xFFFFFF,
                active: 0xAA0000,
            },
            labelColor: {
                default: 0xFFFFFF,
                hover: 0x333333,
                active: 0xFFFFFF,
            },
            label: label,
            labelSize: 24,
            onClick: () => {
                // 先把介面毀了，再開始遊戲
                this.destroy();
                this.gameApp.startGame(level);
            },
        });
        this.addChild(button);
        button.x = 50;
        button.y = 40 + (level - 1) * 50;
        return button;
    }
}
