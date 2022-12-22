import { Graphics, Point } from "pixi.js";
import { RandomGenerator } from "../lib/RandomGenerator";
import { TreeGenerator } from "./TreeGenerator";

export class Branch {
    // 亂數產生器
    rng: RandomGenerator;
    // 子枝陣列
    children: Branch[] = [];
    // 繪圖器
    graphics = new Graphics();

    constructor(
        public tree: TreeGenerator,
        public options: {
            position: Point, // 出生位置
            angle: number,   // 生長方向
            size: number,    // 粗細
            length: number,  // 長度
            seed: number,    // 亂數種子
            color: number,   // 顏色
        }
    ) {
        this.rng = new RandomGenerator(options.seed);
        // 將graphics加到Pixi的舞台上
        tree.app.stage.addChild(this.graphics);
    }
    /**
     * 解構函式
     */
    destroy(): void {
        this.graphics.destroy();
        this.children.forEach(child => child.destroy());
    }
    /**
     * 計算樹枝尾端的位置
     */
    getEndPosition(): Point {
        const options = this.options;
        // 轉換生長角度為弧度
        const radians = options.angle / 180 * Math.PI;
        // 計算樹枝頭尾的向量
        let vector = new Point(options.length).rotate(radians);
        // 尾端 = 起點 + 生長向量
        return options.position.add(vector);
    }
    /**
     * 產生接在這根樹枝尾端的子枝
     */
    createChildren(): void {
        const options = this.options;
        const treeOps = this.tree.options;
        const rng = this.rng;
        // 粗細比1大才會生出子枝
        if (options.size > 1) {
            // 亂數決定下一段是單枝還是要分兩枝
            if (rng.next() < treeOps.branchRate) {
                // 要生雙枝
                this.children = this.createTwoBranches();
            } else {
                // 只要單枝
                this.children = this.createOneBranch();
            }
            // 讓子枝再去生孩子
            this.children.forEach(child => child.createChildren());
        } else {
            // 最細的樹枝尾端要長花
            let petals = this.createPetals();
            // petal 也是一段Branch，只是參數不同
            this.children = this.children.concat(petals);
        }

        // 如果這個樹枝夠細，就讓它長葉子
        if (options.size <= treeOps.leafBranchSize) {
            let leaves = this.createLeaves();
            // leaf 也是一段Branch，只是參數不同
            this.children = this.children.concat(leaves);
        }
    }
    /**
     * 從尾端長單枝
     */
    createOneBranch(): Branch[] {
        const options = this.options;
        const treeOps = this.tree.options;
        const rng = this.rng;
        // 計算新枝的生長方向
        let angle = options.angle + rng.nextBetween(-20, 20);
        //　新枝要變細一點
        let size = options.size - 1;
        // 長度是用size去計算的（size越小，長度越短）
        let length = (size + 3) / (treeOps.trunkSize + 3) * 80;
        // 再把長度加一點亂數調味
        length *= rng.nextBetween(0.5, 1);
        // 創造新枝
        let branch = new Branch(
            this.tree,
            {
                position: this.getEndPosition(),
                angle: angle,
                size: size,
                length: length,
                seed: rng.nextInt(999999),
                color: options.color, // 枝幹同色
            }
        );
        // 以陣列的方式回傳這一根新枝
        return [branch];
    }
    /**
     * 從尾端長雙枝
     */
    createTwoBranches(): Branch[] {
        const options = this.options;
        const treeOps = this.tree.options;
        const rng = this.rng;
        let branches: Branch[] = [];
        // 計算新枝的生長大方向
        let angleAvg = options.angle + rng.nextBetween(-20, 20);
        // 兩根樹枝的夾角在30度到90度之間
        let angleInBetween = rng.nextBetween(30, 90);
        // 計算兩根樹枝的生長方向
        let angles = [
            angleAvg - angleInBetween / 2,
            angleAvg + angleInBetween / 2,
        ];
        //　新枝要變細一點
        let size = options.size - 1;
        // 長度是用size去計算的（size越小，長度越短）
        let length = (size + 3) / (treeOps.trunkSize + 3) * 80;
        // 迴圈以創造新枝
        for (let angle of angles) {
            let branch = new Branch(
                this.tree,
                {
                    position: this.getEndPosition(),
                    angle: angle,
                    size: size,
                    length: length * rng.nextBetween(0.5, 1),
                    seed: rng.nextInt(999999),
                    color: options.color, // 枝幹同色
                }
            );
            branches.push(branch);
        }
        return branches;
    }
    /**
     * 從尾端長花瓣
     */
    createPetals(): Branch[] {
        const options = this.options;
        const treeOps = this.tree.options;
        const rng = this.rng;
        let petals: Branch[] = [];
        // 花瓣構成的圓的總角度
        let anglesTotal = 240;
        // 花瓣數量
        let count = 8;
        // 花瓣之間的夾角
        let angleInterval = anglesTotal / (count - 1);
        // 第一片花瓣的角度
        let startAngle = options.angle - anglesTotal / 2;
        // 迴圈count次，生出所有花瓣
        for (let i = 0; i < count; i++) {
            let petal = new Branch(
                this.tree,
                {
                    position: this.getEndPosition(),
                    angle: startAngle + i * angleInterval,
                    size: 4,    // 花瓣的粗細
                    length: 10, // 花瓣的長度
                    seed: rng.nextInt(999999),
                    color: treeOps.flowerColor,
                }
            );
            petals.push(petal);
        }
        return petals;
    }
    /**
     * 沿樹枝長葉子
     */
    createLeaves(): Branch[] {
        const options = this.options;
        const treeOps = this.tree.options;
        const rng = this.rng;
        let leaves: Branch[] = [];
        // 沿樹枝，每6個單位長度長一片葉子
        let interval = 6;
        // 轉換樹枝方向的單位為弧度，等一下計算向量時需要用
        const radians = options.angle / 180 * Math.PI;
        // 葉子與樹枝之間的夾角
        let angleToLeaf = 60;
        // 從離起點0距離開始，每次迴圈加interval距離，一直到超過樹枝長度時離開
        for (let dist = 0; dist < options.length; dist += interval) {
            // 計算葉子離起點的向量
            let vector = new Point(dist).rotate(radians);
            // 葉子的出生位置 = 樹枝起點 + 距離向量
            let leafPos = options.position.add(vector);
            // 隨機選擇葉子在樹枝的左邊還是右邊
            let rightSide = rng.next() > 0.5;
            // 計算葉子的生長角度
            let leafAngle = options.angle + (
                rightSide ? angleToLeaf : -angleToLeaf
            );
            // 造一片葉子
            let leaf = new Branch(
                this.tree,
                {
                    position: leafPos,
                    angle: leafAngle,
                    size: 3,
                    length: 5 + options.size,
                    seed: rng.nextInt(999999),
                    color: treeOps.leafColor,
                }
            );
            leaves.push(leaf);
        }
        return leaves;
    }
    /**
     * 用一個屬性來記錄目前我們畫到什麼進度
     */
    drawnPercent = 0;
    /**
     * 畫圖函式
     * @param percent 完成度的百分比(0-1)
     */
    draw(percent: number): void {
        if (this.drawnPercent == percent) {
            // 如果我們剛剛就是畫到這個百分比，那就不用重畫了
            return;
        }

        const options = this.options;
        const start = options.position;
        // 樹枝生長方向的向量 = 生長終點 - 起點
        let vector = this.getEndPosition().sub(start);
        // 在生長到percent時的終點
        let end = new Point(
            start.x + vector.x * percent,
            start.y + vector.y * percent
        );
        // 準備畫線，先清除之前畫的東西
        this.graphics.clear();
        // 設定畫線筆刷
        this.graphics.lineStyle({
            width: options.size,
            color: options.color,
        });
        // 移動筆刷到起點(不畫)
        this.graphics.moveTo(start.x, start.y);
        // 畫線到終點
        this.graphics.lineTo(end.x, end.y);
        // 記錄我們現在畫到哪兒了
        this.drawnPercent = percent;
    }
    /**
     * 遞迴式畫圖函式
     * @param timepassed 給我畫圖的時間
     */
    drawDeeply(timepassed: number): void {
        const options = this.options;
        const treeOps = this.tree.options;
        // 畫完本枝需要的時間 = 本枝長度 / 畫圖速度
        let timeToComplete = options.length / treeOps.drawSpeed;
        // 需要畫出來的進度，限制進度最大到1(即100%)
        let percent = Math.min(1, timepassed / timeToComplete);
        // 畫出本枝
        this.draw(percent);
        // 把經過時間減掉畫完本枝需要的時間後
        timepassed -= timeToComplete
        // 若時間還有剩，就把這時間丟給子枝們去畫
        if (timepassed > 0) {
            this.children
                .forEach(child => child.drawDeeply(timepassed));
        }
    }
}