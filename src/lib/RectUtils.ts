import { Rectangle } from "pixi.js";

declare module "pixi.js" {
    class Rectangle {
        /**
         * 檢查另一個矩形是否在這個矩形內
         * @param other 另一個矩形
         */
        containsRect(other: Rectangle): boolean;
    }
}

Rectangle.prototype.containsRect = function(other: Rectangle) {
    return (
        other.x >= this.x &&
        other.y >= this.y &&
        other.right <= this.right &&
        other.bottom <= this.bottom
    )
}