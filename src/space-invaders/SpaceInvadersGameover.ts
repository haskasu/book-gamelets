import { Container, Graphics, Text } from "pixi.js";
import { keyboardManager } from "../lib/keyboard/KeyboardManager";
import { KeyCode } from "../lib/keyboard/KeyCode";
import { getStageSize, wait } from "../main";
import { SpaceInvadersGame } from "./SpaceInvadersGame";

export class SpaceInvadersGameover extends Container {

    constructor(public game: SpaceInvadersGame) {
        super();
        this.loadUI();
    }
    async loadUI() {
        this.createBackground();
        this.createGameoverText();
        await wait(120);
        this.createRestartText();
        await this.waitUserPressSpace();
        this.destroy();
        // 重建遊戲
        this.game.destroy();
        new SpaceInvadersGame(this.game.app);
    }
    private createBackground() {
        let graphics = new Graphics();
        graphics.beginFill(0, 0.8);
        graphics.drawRect(
            0,
            30,
            getStageSize().width,
            getStageSize().height - 30
        );
        graphics.endFill();
        this.addChild(graphics);
    }
    private createGameoverText() {
        let text = new Text('GAME OVER', {
            fontFamily: 'SpaceInvadersFont',
            fontSize: 48,
            fill: '#FF0000',
        });
        text.position.set(
            (getStageSize().width - text.width) / 2,
            getStageSize().height / 2 - text.height
        );
        this.addChild(text);
    }
    private async createRestartText() {
        let text = new Text('press SPACE to try again', {
            fontFamily: 'SpaceInvadersFont',
            fontSize: 24,
            fill: '#FFFFFF',
        });
        text.position.set(
            (getStageSize().width - text.width) / 2,
            getStageSize().height * 0.6
        );
        this.addChild(text);
        while (!text.destroyed) {
            text.visible = !text.visible;
            await wait(60);
        }
    }
    async waitUserPressSpace() {
        const key = KeyCode.SPACE;
        await keyboardManager.waitUserPressKey(key);
        await keyboardManager.waitUserReleaseKey(key);
    }
}
