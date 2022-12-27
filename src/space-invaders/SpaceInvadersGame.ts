import { Application } from "pixi.js";
import { getStageSize, wait } from "../main";
import { Invader } from "./Invader";
import { PlayerCannon } from "./PlayerCannon";

export class SpaceInvadersGame {

	cannon: PlayerCannon;

	invaders: Invader[] = [];

	invadersTurning = false;

	constructor(public app: Application) {
		this.cannon = new PlayerCannon(this);
		this.createInvadersRow({
			type: 0, // 外形一
			x: 120,
			y: 240,
			amount: 6,
		});
		this.createInvadersRow({
			type: 1, // 外形二
			x: 100,
			y: 200,
			amount: 6,
		});
		this.createInvadersRow({
			type: 2, // 外形三
			x: 120,
			y: 160,
			amount: 6,
		});
		// 大軍齊步走，每20個tick向右走10個像素
		this.moveInvadersLoop(10, 20);
	}

	destroy() {
		this.cannon.destroy();
		this.invaders.forEach((invader) => {
			invader.destroy();
		});
	}

	private createInvadersRow(options: {
		type: number,  // 外形
		x: number,     // 最左邊的x
		y: number,     // 這一排的y
		amount: number // 總共要幾隻
	}) {
		let xInterval = 60; // x間隔
		for (let i = 0; i < options.amount; i++) {
			let invader = new Invader(
				this,
				options.x + i * xInterval,
				options.y,
				options.type
			);
			this.invaders.push(invader);
		}
	}

	moveInvaders(moveX: number, moveY: number) {
		for (let invader of this.invaders) {
			invader.x += moveX;
			invader.y += moveY;
		}
	}

	async moveInvadersLoop(moveX: number, delay: number) {
		await wait(delay);
		this.moveInvaders(moveX, 0);
		if (this.needToTurnInvaders(moveX)) {
			await wait(delay);
			this.moveInvaders(0, 20);
			moveX = -moveX;
		}
		this.moveInvadersLoop(moveX, delay);
	}

	private needToTurnInvaders(moveX: number): boolean {
		// 如果目前大軍朝右走
		if (moveX > 0) {
			// 找出最靠右的侵略者
			let maxXInvader = this.invaders.reduce(
				(maxInvader, currInvader) => {
					if (maxInvader.x > currInvader.x) {
						return maxInvader;
					} else {
						return currInvader;
					}
				}
			);
			// 回傳最右側侵略者的x是不是超出邊界的右邊
			return maxXInvader.x > getStageSize().width - maxXInvader.width;
		} else {
			// 找出最靠左的侵略者
			let minXInvader = this.invaders.reduce(
				(minInvader, currInvader) => {
					if (minInvader.x < currInvader.x) {
						return minInvader;
					} else {
						return currInvader;
					}
				}
			);
			// 回傳最左側侵略者的x是不是超出邊界的左邊
			return minXInvader.x < minXInvader.width;
		}
	}
}
