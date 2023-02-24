import { update } from "@tweenjs/tween.js";
import { Ticker } from "pixi.js";
import { ArrayUtils } from "./ArrayUtils";

class WaitProxy {

    private _destroyed = false;

    constructor(
        public endTime: number,
        public resolve: () => void,
        public reject: (error: string) => void
    ) {

    }

    destroy() {
        this._destroyed = true;
    }

    get destroyed(): boolean {
        return this._destroyed;
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
        while (this.waits.length) {
            let first = this.waits[0];
            if (first.endTime > this.now) {
                break;
            }
            this.waits.shift();
            if (!first.destroyed) {
                first.resolve();
            }
        }
        // 呼叫Tween.js的更新函式
        update(performance.now());
    }

    public add(ticks: number) {
        return new Promise<void>((resolve, reject) => {
            let wait = new WaitProxy(
                this.now + ticks,
                resolve,
                reject
            );
            this.waits.push(wait);
            ArrayUtils.sortNumericOn(this.waits, 'endTime');
        })
    }
}
