import { GUI } from "dat.gui";
import { TreeGenerator } from "./TreeGenerator";

export class OptionsEditor {
    // 建立參數面板
    gui = new GUI();

    constructor(public generator: TreeGenerator) {
        let options = generator.options;
        this.gui.add(options, 'seed', 1, 99999, 1);
        this.gui.add(this, 'onButtonGrow').name("重新生長");
        this.gui.add(this, 'onButtonNext').name("下一顆樹");
        this.gui.add(options, 'trunkSize', 1, 10, 1)
            .name("主幹粗細");
        this.gui.add(options, 'trunkLength', 1, 200, 1)
            .name("主幹長度");
        this.gui.add(options, 'branchRate', 0, 1, 0.1)
            .name("分支機率");
        this.gui.add(options, 'drawSpeed', 1, 20, 1)
            .name("生長速度");
        this.gui.add(options, 'leafBranchSize', 1, 10, 1)
            .name("長葉支幹粗細");
        this.gui.addColor(options, 'branchColor')
            .name('枝幹顏色');
        this.gui.addColor(options, 'leafColor')
            .name('樹葉顏色');
        this.gui.addColor(options, 'flowerColor')
            .name('花朵顏色');
    }

    onButtonGrow() {
        this.generator.newTree();
    }

    onButtonNext() {
        this.generator.options.seed++;
        this.generator.newTree();
        this.gui.updateDisplay();
    }
}
