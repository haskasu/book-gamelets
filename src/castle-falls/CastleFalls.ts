import { Application } from "pixi.js";
import { CastleFallsGame } from "./CastleFallsGame";
import { CastleFallsRecord } from "./CastleFallsRecord";
import { LevelsUI } from "./LevelsUI";

export class CastleFalls {
    // 遊戲進度的記錄物件
    record = new CastleFallsRecord();

    constructor(public app: Application) {
        // let engine = this.createMatterWorld();
        // let aligner = new RenderStageAligner(engine, app.stage, getStageSize());
        // StageSizeEvents.on('resize', aligner.align, aligner);
        // 一開始要先打開選關畫面
        this.openLevelsUI();
    }
    // 打開選關畫面
    openLevelsUI() {
        let ui = new LevelsUI(this);
        this.app.stage.addChild(ui);
    }
    // 開始遊戲
    startGame(level: number) {
        let game = new CastleFallsGame(this, level);
        this.app.stage.addChild(game);
    }
}
