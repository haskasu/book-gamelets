import { Engine, Render } from "matter-js";
import { Container } from "pixi.js";

export class MatterRender {

    render: Render;

    constructor(
        public engine: Engine,
        public stage: Container,
        stageSize: { width: number, height: number }
    ) {
        // 建立Render，設定畫板的css，對齊Pixi，加入時間洪流
        this.render = this.createRender(stageSize);
        this.initRenderView(this.render);
        this.align();
        Render.run(this.render);
    }
    destroy() {
        Render.stop(this.render);
        this.render.canvas.remove();
    }
    /** 建構matter的繪圖器 */
    private createRender(size: { width: number, height: number }) {
        return Render.create({
            engine: this.engine,
            element: document.body,
            options: {
                width: size.width,
                height: size.height,
                wireframeBackground: 'transparent',
                wireframes: false,
                background: 'transparent',
                
            }
        });
    }
    /** 改變繪圖器的CSS，使其排版時的位置使用絕對座標 */
    private initRenderView(render: Render) {
        // 取得matter.js的畫板樣式
        const canvasStyle = render.canvas.style;
        // 將畫板位置設為絕對位置
        canvasStyle.position = 'absolute';
        // 畫板縮放的參考原點設在左上角
        canvasStyle.transformOrigin = '0 0';
        // 取消畫板和滑鼠的互動
        canvasStyle.pointerEvents = 'none';
    }
    /** 對齊舞台的位置與縮放比例 */
    align = (stageSize?: { width: number, height: number }) => {
        const canvasStyle = this.render.canvas.style;
        const stage = this.stage;
        // 對齊舞台的位置與縮放比例
        canvasStyle.left = stage.x + 'px';
        canvasStyle.top = stage.y + 'px';
        canvasStyle.transform = `scale(${stage.scale.x})`;
        // 如果有給舞台大小，那麼順便同步畫布尺寸
        if (stageSize) {
            const canvas = this.render.canvas;
            canvas.width = stageSize.width;
            canvas.height = stageSize.height;
        }
    }
}
