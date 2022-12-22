/**
 * 檔案 src/lib/ArrayUtils.ts 
 */
export class ArrayUtils {
    /**
     * 在陣列裏加入一個唯一的元素。
     * @param array 目標陣列
     * @param item 要加入的元素
     * @returns 若元素是唯一的且被加入則回傳true
     */
    static addUniqueItem(
        array: unknown[],
        item: unknown
    ): boolean {
        if (array.includes(item)) {
            return false;
        }
        array.push(item);
        return true;
    }
    /**
     * 移除陣列中的一個元素。
     * @param array 目標陣列
     * @param item 要移除的元素
     * @returns 若成功移除元素則回傳true
     */
    static removeItem(
        array: unknown[],
        item: unknown
    ): boolean {
        let index = array.indexOf(item);
        if (index == -1) {
            return false;
        }
        // 使用slice()在index的位置刪除1個元素
        array.splice(index, 1);
        return true;
    }
    /**
     * 從陣列中隨機取一個元素。
     * @param array 目標陣列
     * @param remove (可省略)要不要除移選到的元素
     * @returns 隨機選擇的元素
     */
    static getRandomItem<T>(
        array: T[],
        remove?: boolean
    ): T {
        // 如果陣列是空的，回傳undefined
        if (!array.length) {
            throw new Error('無法從空陣列取元素')
        }
        // 取一個介於0到array.length的亂數
        let rand = Math.random() * array.length;
        // 無條件捨去小數位取整數
        let index = Math.floor(rand);
        // 準備要回傳的元素
        let item = array[index];
        // 如果需要，就移除位於index的元素
        if (remove) {
            array.splice(index, 1);
        }
        return item;
    }
    /**
     * 排序數字陣列
     * @param array 目標陣列
     * @param descending (可省略)是否要由大至小排
     */
    public static sortNumeric(
        array: number[],
        descending?: boolean
    ) {
        if (descending) {
            array.sort((a, b) => b - a);
        } else {
            array.sort((a, b) => a - b);
        }
    }
    /**
     * 排序物件陣列
     * @param array 目標陣列
     * @param key 排序依尋的屬性
     * @param descending (可省略)是否要由大至小排
     */
    public static sortNumericOn(
        array: any[],
        key: string,
        descending?: boolean
    ) {
        if (descending) {
            array.sort((a, b) => b[key] - a[key]);
        } else {
            array.sort((a, b) => a[key] - b[key]);
        }
        return array;
    }
    /**
     * 交換兩個陣列元素的位置
     * @param array 目標陣列
     * @param index1 第一個元素位置
     * @param index2 第二個元素位置
     */
     public static swapAt(
        array: unknown[],
        index1: number,
        index2: number
    ) {
       let element1 = array[index1];
        array[index1] = array[index2];
        array[index2] = element1;
   }
}