import '../lib/PointUtils'
import { ObservablePoint, Point } from 'pixi.js'
import { test, expect } from 'vitest'

test('兩種IPoint類別的向量長度', () => {
    let point = new Point(3, 4);
    let obPoint = new ObservablePoint(
        () => { },
        null,
        13500,
        12709
    );
    expect(point.length()).toBe(5);
    expect(obPoint.length()).toBe(18541);
})
test('向量正規化', () => {
    let point = new Point(3, 4);

    expect(point.normalize(100)).toBe(5);
    expect(point.length()).toBe(100);
})
test('向量加減', () => {
    let point = new Point(3, 4);
    
    point = point.add(new Point(10, 10));
    expect(point).toEqual(new Point(13, 14))
    
    point = point.sub(new Point(1, 1));
    expect(point).toEqual(new Point(12, 13))
})
test('向量旋轉', () => {
    let point = new Point(3, 4);
    point.rotate(Math.PI / 2);

    expect(point.x).toBeCloseTo(-4)
    expect(point.y).toBeCloseTo(3)
})