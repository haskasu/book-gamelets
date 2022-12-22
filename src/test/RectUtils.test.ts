import '../lib/RectUtils'
import { Rectangle } from 'pixi.js'
import { test, expect } from 'vitest'

test('containsRect', () => {
    let rect = new Rectangle(0, 0, 100, 100);
    let smallRect = new Rectangle(10, 10, 20, 20);
    expect(rect.containsRect(smallRect)).toBe(true);
})