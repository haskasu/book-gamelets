import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";
import { SpaceInvadersGame } from "./SpaceInvadersGame";
import cannonballsImage from '../images/cannonballs.png';

export class Cannonball {
	// 砲彈的圖
	sprite = new Sprite();

	constructor(public game: SpaceInvadersGame, x: number, y: number) {
		this.initSprite(x, y);
	}
	private initSprite(x: number, y: number): void {
		// 載入圖片
		let baseTexture = BaseTexture.from(cannonballsImage);
		// 建立材質
		let imageRect = new Rectangle(1, 0, 4, 14);
		let texture = new Texture(baseTexture, imageRect);
		// 新增精靈圖
		this.sprite.texture = texture;
		// 把精靈圖放到舞台上
		this.game.app.stage.addChildAt(this.sprite, 0);
		// 移到初始位置
		this.sprite.position.set(x, y);
		// 調整圖片軸心
		this.sprite.pivot.set(
			imageRect.width / 2,
			imageRect.height / 2
		);
	}
}
