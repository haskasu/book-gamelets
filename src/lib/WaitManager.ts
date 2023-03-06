import { update } from "@tweenjs/tween.js";
import { Ticker } from "pixi.js";
import { ArrayUtils } from "./ArrayUtils";

class WaitProxy {

    constructor(
        public endTime: number,
        public resolve: () => void,
        public reject: (error: string) => void
    ) {

    }

    cancel() {
        this.reject("Wait canceled")
    }
}

export class WaitManager {

    private waits: WaitProxy[] = []

    private now = 0;

    constructor(public ticker: Ticker) {
        ticker.add(this.update, this);
    }

    destroy() {
        this.ticker.remove(this.update, this);
    }

    private update(dt: number) {
        this.now += dt;
        // 持續loop，直到沒有等待了
        while (this.waits.length) {
            // 取出最前面的等待
            let first = this.waits[0];
            // 如果時間還沒到，離開loop，不用再往下查了
            if (first.endTime > this.now) {
                break;
            }
            // 把最前面的等待移除(也就是first)
            this.waits.shift();
            // 兌現等待的承諾
            first.resolve();
        }
        // 呼叫Tween.js的更新函式
        update(performance.now());
    }

    public add(ticks: number) {
        return new Promise<void>((resolve, reject) => {
            let wait = new WaitProxy(
                // 建立等待物件
                this.now + ticks,
                resolve,
                reject
            );
            // 放到等待陣列
            this.waits.push(wait);
            // 將陣列以endTime排序
            ArrayUtils.sortNumericOn(this.waits, 'endTime');
        })
    }
}
