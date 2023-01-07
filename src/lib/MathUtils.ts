export class MathUtils {
    // 常用常數 2π
    static TWO_PI = Math.PI * 2;
    // 將角度正規化至-180與180之間
    static normalizeDegree(degree: number) {
        while (degree > 180) {
            degree -= 360;
        }
        while (degree <= -180) {
            degree += 360;
        }
        return degree;
    }
    // 將弧度正規化至-π與π之間
    static normalizeRadians(radians: number) {
        while (radians > Math.PI) {
            radians -= MathUtils.TWO_PI;
        }
        while (radians <= -Math.PI) {
            radians += MathUtils.TWO_PI;
        }
        return radians;
    }
}
