import { Application } from "pixi.js";
import { ArrayUtils } from "../lib/ArrayUtils";
import { getStageSize, wait } from "../main";
import { Invader } from "./Invader";
import { PlayerCannon } from "./PlayerCannon";
import { playSound } from "../lib/SoundUtils";
import invadersMoveSnd from '../sounds/invadersMove.wav';
import { InvaderDrop } from "./InvaderDrop";
export class SpaceInvadersGame {

	cannon: PlayerCannon;

	invaders: Invader[] = [];

	invadersMoveInterval = 5;

	invadersShootInterval = 90;

	destroyed = false;

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
		// 大軍齊步走，每幾個tick向右走10個像素
		this.moveInvadersLoop(10);
		// 大軍攻擊循環
		this.invadersShootLoop();
	}

	destroy() {
		this.cannon.destroy();
		this.invaders.forEach((invader) => {
			invader.destroy();
		});
		this.destroyed = true;
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

	async moveInvadersLoop(moveX: number) {
		if (this.destroyed) {
			// 若遊戲已毀壞，直接結束這個函式
			return;
		}
		const delay = this.invadersMoveInterval;
		await wait(delay);
		// 如果還有外星人在飛才要群體移動
		if (this.invaders.length) {
			this.moveInvaders(moveX, 0);
			if (this.invadersNeedToTurn(moveX)) {
				if (this.invadersNeedToGoDown()) {
					await wait(delay);
					this.moveInvaders(0, 20);
				}
				moveX = -moveX;
			}
		}
		this.moveInvadersLoop(moveX);
		playSound(invadersMoveSnd, { volume: 0.2 });
	}

	private invadersNeedToTurn(moveX: number): boolean {
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
	private invadersNeedToGoDown(): boolean {
		// 找出最靠下方的侵略者
		let maxYInvader = this.invaders.reduce(
			(maxInvader, currInvader) => {
				if (maxInvader.y > currInvader.y) {
					return maxInvader;
				} else {
					return currInvader;
				}
			}
		);
		// 回傳最下方侵略者的y是不是超出下方邊界
		return maxYInvader.y < getStageSize().height - maxYInvader.height;
	}
	/**
	 * 移除並毀滅外星人
	 */
	async hitAndRemoveInvader(invader: Invader) {
		// 把invader從陣列中移除
		ArrayUtils.removeItem(this.invaders, invader);
		// 讓 invader 顯示毀滅動畫並自我清除
		await invader.hitAndDead();
	}
	/**
	 * 大軍攻擊循環函式
	 */
	async invadersShootLoop() {
		// 等待週期
		let delay = this.invadersShootInterval;
		await wait(delay);
		// 如果還有外星人在飛才要發動攻擊
		if (this.invaders.length) {
			// 從大軍中隨機選一位外星人發動攻擊
			let invader = ArrayUtils.getRandomItem(this.invaders);
			// 發射
			new InvaderDrop(this, invader.x, invader.y);
		}
		// 遞迴呼叫自己，進入攻擊循環
		this.invadersShootLoop();
	}
	/**
	 * 處理玩家砲台被擊中的函式。
	 */
	async hitPlayerCannon() {
		await this.cannon.hitAndDead();
		// 多等60個tick(約一秒)
		await wait(60);
		// 重建新砲台
		this.cannon = new PlayerCannon(this);
	}
}
