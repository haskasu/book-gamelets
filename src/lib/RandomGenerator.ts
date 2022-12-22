import { ArrayUtils } from "./ArrayUtils";


export class RandomGenerator {
    /** 建構子要給一個亂數種子，預設為1 */
    constructor(public seed: number = 1) {
        // 丟棄第一個亂數
        this.next();
    }
    /** 產生下一個亂數 */
    public next(): number {
        // seed不可以等於0，不然後面算出來會是0的循環數列
        if (this.seed == 0) {
            // 如果seed是0，就用一個自訂的種子
            this.seed = 123456789;
        }
        // Lehmer亂數演算法
        this.seed = (this.seed * 16807) % 2147483647;
        // 回傳一個介於０到１的亂數
        return this.seed / 2147483647;
    }

    /**
     * 產生介於min和max的亂數
     * @param min 最小值
     * @param max 最大值
     * @returns 介於min和max的亂數
     */
    public nextBetween(min: number, max: number): number {
        return min + (max - min) * this.next();
    }

    /**
     * 產生介於0和max之間的亂整數，0和max都是可能的回傳值。
     * @param max 最大可能值
     * @returns 介於0和max的亂整數
     */
    public nextInt(max: number): number {
        let value = (max + 1) * this.next();
        return Math.floor(value);
    }

    /**
     * 產生介於min和max之間的亂整數，min和max都是可能的回傳值。
     * @param min 最小可能值
     * @param max 最大可能值
     * @returns 介於min和max的亂整數
     */
    public nextIntBetween(min: number, max: number): number {
        let value = min + (max - min + 1) * this.next();
        return Math.floor(value);
    }

    /**
     * 產生一個長度為length的隨機字串。
     * @param length 回傳的字串長度
     * @param incNums (可省略)是否要加入數字
     * @returns 隨機字串
     */
    public getRandomString(length: number, incNums?: boolean): string {
        let chars = 'abcdefghijklmnopqrstuvwxyz';
        if (incNums) {
            chars += '0123456789';
        }
        let charLength = chars.length;
        let output = '';
        while (output.length < length) {
            let index = Math.floor(charLength * this.next());
            output += chars[index];
        }
        return output;
    }

    /**
     * 隨機排列陣列中的元素。
     * @param array 目標陣列
     */
    public randomizeArray(array: unknown[]) {
        let length = array.length;
        for (let i = 0; i < length; i++) {
            let swapTo = Math.floor(length * this.next());
            ArrayUtils.swapAt(array, i, swapTo);
        }
    }

    /**
     * 從陣列中隨機取一個元素。
     * @param array 目標陣列
     * @param remove (可省略)要不要除移選到的元素
     * @returns 隨機選擇的元素
     */
    public getArrayRandomItem<T>(array: T[], remove?: boolean): T {
        if (!array.length) {
            throw new Error('無法從空陣列取出元素');
        }
        let index = Math.floor(array.length * this.next());
        let item = array[index];
        if (remove) {
            array.splice(index, 1);
        }
        return item;
    }
}