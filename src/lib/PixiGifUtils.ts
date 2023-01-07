import { AnimatedGIF, AnimatedGIFOptions } from "@pixi/gif";
import { Assets } from "pixi.js";

export async function gifFrom(
    source: string | ArrayBuffer,
    options?: Partial<AnimatedGIFOptions>
) {
    // 如果source是ArrayBuffer
    if (source instanceof ArrayBuffer) {
        // 直接產生AnimatedGIF
        let gif = AnimatedGIF.fromBuffer(source);
        return Promise.resolve(gif);
    } else {
        // 使用Pixi的Assets資源管理系統載入GIF
        let gif = await Assets.load({
            src: source,
            data: options,
        });
        return gif as AnimatedGIF;
    }
}