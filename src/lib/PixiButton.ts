import { Container, Graphics, Text } from "pixi.js";

interface PixiButtonOptions {
    // 長寬尺寸
    width: number,
    height: number,
    // 圓角
    cornerRadius: number,
    // 按鈕標籤的文字與大小
    label: string;
    labelSize: number;
    // 按鈕文字在三種狀態下的顏色
    labelColor: {
        default: number,
        hover: number,
        active: number,
    };
    // 按鈕背景在三種狀態下的顏色
    backgroundColor: {
        default: number,
        hover: number,
        active: number,
    };
    // 按鈕觸發的回呼函式
    onClick: () => void;
}

export class PixiButton extends Container {

    constructor(public options: PixiButtonOptions) {
        super();
        this.buildUI();
    }
    // 建立按鈕介面
    buildUI() {
        const options = this.options;
        const backgroundColor = options.backgroundColor;
        const labelColor = options.labelColor;
        // 幫按鈕加上圓角方形的背景
        let bg = new Graphics();
        bg.beginFill(0xFFFFFF);
        bg.drawRoundedRect(
            0, 0,
            options.width, options.height, 
            options.cornerRadius
        );
        bg.endFill();
        // 預設的按鈕背景底色
        bg.tint = backgroundColor.default;
        this.addChild(bg);
        // 加再上遊戲名字作為按鈕標籤
        let label = new Text(options.label, {
            fontSize: options.labelSize,
            fill: labelColor.default,
        });
        label.resolution = 2;
        // 置中按鈕標籤
        label.position.set(
            (bg.width - label.width) / 2,
            (bg.height - label.height) / 2
        );
        this.addChild(label);
        // 設定按鈕和互動相關的屬性
        this.interactive = true;
        this.cursor = 'pointer';
        // 監聽滑鼠事件: 點擊後執行按鈕的回呼函式
        this.on('click', () => {
            bg.tint = backgroundColor.hover;
            label.style.fill = labelColor.hover;
            options.onClick();
        });
        // 滑鼠懸浮在按鈕上方
        this.on('pointerover', () => {
            bg.tint = backgroundColor.hover;
            label.style.fill = labelColor.hover;
        });
        // 滑鼠離開按鈕
        this.on('pointerout', () => {
            bg.tint = backgroundColor.default;
            label.style.fill = labelColor.default;
        });
        // 在按鈕上按下左鍵
        this.on('pointerdown', () => {
            bg.tint = backgroundColor.active;
            label.style.fill = labelColor.active;
        });
        // 手機的觸碰結束事件
        this.on('touchend', (event) => {
            this.emit('click', event);
        });
    }
}
