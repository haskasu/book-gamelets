/** 檔案 src/test/Arrayutils.test.ts */
import { ArrayUtils } from "../lib/ArrayUtils"
import { test, expect } from 'vitest'

test('addUniqueItem', () => {
    let array = ["a", "b", "c"];
    expect(ArrayUtils.addUniqueItem(array, "a"))
        .toBe(false)
    expect(array.length).toBe(3)
    expect(ArrayUtils.addUniqueItem(array, "d"))
        .toBe(true)
    expect(array.length).toBe(4)
})
test('物件陣列:依屬性排序', () => {
    let array = [
        {id: 'p1', name: 'Haska', power: 1},
        {id: 'p2', name: 'Anita', power: 99},
        {id: 'p3', name: 'Laputa', power: 5},
    ];
    ArrayUtils.sortNumericOn(array, 'power', true);
    // 期望排序後第一個元素的power為99
    expect(array[0].power).toBe(99);
})
