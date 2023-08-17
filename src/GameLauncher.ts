import { Application, Container } from "pixi.js";
import { CastleFalls } from "./castle-falls/CastleFalls";
import { PixiButton } from "./lib/PixiButton";
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
        this.createButton('經典小蜜蜂', 160, () => {
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
        let button = new PixiButton({
            width: 480,
            height: 48,
            cornerRadius: 24,
            backgroundColor: {
                default: 0x666666,
                hover: 0x3F51B5,
                active: 0x2244aa,
            },
            labelColor: {
                default: 0xFFFFFF,
                hover: 0xFFFFFF,
                active: 0xFFFF00,
            },
            label: name,
            labelSize: 32,
            onClick: () => {
                this.destroy();
                onClick();
            },
        });
        this.addChild(button);
        // 滑鼠置中
        button.x = (getStageSize().width - button.width) / 2;
        button.y = y;
    }
}
