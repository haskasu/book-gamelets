import { Application, Point } from "pixi.js";
import { getStageSize } from "../main";
import { Branch } from "./Branch";
import { OptionsEditor } from "./OptionsEditor";

export class TreeGenerator {
    // 植樹參數
    options = {
        seed: 1,           // 亂數種子
        trunkSize: 10,     // 主幹粗細
        trunkLength: 120,  // 主幹長度
        branchRate: 0.8,   // 分支機率
        drawSpeed: 3,    // 樹的成長速度
        leafBranchSize: 4, // 這個粗細以下的樹枝會長葉子

        branchColor: 0xFFFFFF, // 樹枝顏色
        leafColor: 0x00AA00,   // 葉子顏色
        flowerColor: 0xFF6666, // 花的顏色
    }
    // 畫圖時用的資料
    drawingData?: {
        mainTrunk: Branch  // 樹的主幹
        timepassed: number // 畫圖的經過時間
    }

    constructor(public app: Application) {
        // 建立一顆新樹
        this.newTree();
        // 預約動畫更新函式
        app.ticker.add(this.drawUpdate, this);
        // 建立參數面板
        new OptionsEditor(this);
    }
    /**
     * 種一顆新樹
     */
    newTree(): void {
        if (this.drawingData) {
            // 如果之前有舊的樹，把舊的樹砍了
            this.drawingData.mainTrunk.destroy();
        }
        const treeOps = this.options;
        const stageSize = getStageSize();
        // 計算舞台左右置中的底部位置，作為主幹的出生位置
        let treePos = new Point(
            stageSize.width / 2,
            stageSize.height
        );
        // 種一顆新樹
        let mainTrunk = new Branch(
            this,
            {
                position: treePos,
                angle: -90,
                size: treeOps.trunkSize,
                length: treeOps.trunkLength,
                seed: treeOps.seed,
                color: treeOps.branchColor,
            }
        );
        // 讓主幹去開枝散葉
        mainTrunk.createChildren();
        // 初始化繪圖動畫需要的資料
        this.drawingData = {
            mainTrunk: mainTrunk,
            timepassed: 0,
        };
    }
    /**
     * 畫圖用的更新函式
     * @param deltaTime 
     */
    drawUpdate(deltaTime: number): void {
        const data = this.drawingData;
        if (data) {
            data.timepassed += deltaTime;
            data.mainTrunk.drawDeeply(data.timepassed);
        }
    }
}
