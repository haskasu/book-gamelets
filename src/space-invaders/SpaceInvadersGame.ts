import { Application, Point } from "pixi.js";
import { ArrayUtils } from "../lib/ArrayUtils";
import { getStageSize, wait } from "../main";
import { Invader } from "./Invader";
import { PlayerCannon } from "./PlayerCannon";
import { playSound } from "../lib/SoundUtils";
import invadersMoveSnd from '../sounds/invadersMove.wav';
import { InvaderDrop } from "./InvaderDrop";
import { SpaceInvadersUI } from "./SpaceInvadersUI";
import { SpaceInvadersGameover } from "./SpaceInvadersGameover";
import { EarthShield } from "./EarthShield";
import { InvaderBoss } from "./InvaderBoss";

export class SpaceInvadersGame {

	cannon: PlayerCannon;

	invaders: Invader[] = [];

	invadersMoveInterval = 20;

	invadersShootInterval = 90;

	destroyed = false;
	gameover = false;
	// 遊戲介面
	ui = new SpaceInvadersUI();
	// 關卡
	level = 1;

	shields: EarthShield[] = [];

	constructor(public app: Application) {
		this.cannon = new PlayerCannon(this);
		this.startLevel(1);
		// 大軍齊步走，每隔幾個tick向右移動10個像素
		this.moveInvadersLoop(10);
		// 大軍攻擊循環
		this.invadersShootLoop();
		// 將UI加到舞台上
		app.stage.addChild(this.ui);
	}

	destroy() {
		this.cannon.destroy();
		this.invaders.forEach((invader) => {
			invader.destroy();
		});
		this.shields.forEach((shield) => {
			shield.destroy();
		});
		this.ui.destroy();
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
			invader.onFlockMove(moveX, moveY);
		}
	}

	async moveInvadersLoop(moveX: number) {
		if (this.destroyed || this.gameover) {
			// 直接結束這個函式，不再進入下個循環
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
			playSound(invadersMoveSnd, { volume: 0.2 });
		}
		// 遞迴呼叫
		this.moveInvadersLoop(moveX);
	}

	private invadersNeedToTurn(moveX: number): boolean {
		// 如果目前大軍朝右走
		if (moveX > 0) {
			// 找出最靠右側的侵略者
			let maxXInvader = this.invaders.reduce(
				(maxInvader, nextInvader) => {
					if (maxInvader.x > nextInvader.x) {
						return maxInvader;
					} else {
						return nextInvader;
					}
				}
			);
			// 回傳最右側侵略者的x是不是超出邊界的右邊
			return maxXInvader.x > getStageSize().width - maxXInvader.width;
		} else {
			// 找出最靠左側的侵略者
			let minXInvader = this.invaders.reduce(
				(minInvader, nextInvader) => {
					if (minInvader.x < nextInvader.x) {
						return minInvader;
					} else {
						return nextInvader;
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
			(maxInvader, nextInvader) => {
				if (maxInvader.y > nextInvader.y) {
					return maxInvader;
				} else {
					return nextInvader;
				}
			}
		);
		// 回傳最下方侵略者的y是不是還沒超出下方邊界
		let maxStageEdge = getStageSize().height - maxYInvader.height;
		return maxYInvader.y < maxStageEdge;
	}
	/**
	 * 移除並毀滅外星人
	 */
	async hitAndRemoveInvader(invader: Invader) {
		// 擊落一隻外星人得10分
		this.ui.addScore(10);
		// 把invader從陣列中移除
		ArrayUtils.removeItem(this.invaders, invader);
		// 讓 invader 顯示毀滅動畫並自我清除
		await invader.hitAndDead();
		// 如果外星人全滅，則進入下一關
		if (!this.invaders.length) {
			this.startLevel(this.level + 1);
		}
	}
	/**
	 * 大軍攻擊循環函式
	 */
	async invadersShootLoop() {
		if (this.destroyed || this.gameover) {
			// 若遊戲已滅，直接結束這個函式
			return;
		}
		// 等待攻擊間隔時間
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
		// 檢查目前剩餘生命是否大於0
		const currLives = this.ui.getLives();
		if (currLives > 0) {
			// 重建一座新的砲台
			this.cannon = new PlayerCannon(this);
			// 更新剩餘生命數
			this.ui.setLives(currLives - 1);
		} else {
			// 遊戲結束
			this.gameover = true;
			let gameOver = new SpaceInvadersGameover(this);
			this.app.stage.addChild(gameOver);
		}
	}
	/**
	 *  依關卡建立所有的侵略者
	 */
	createInvadersAll(level: number) {
		this.createInvadersRow({
			type: 0, // 外形一
			x: 40,
			y: 240,
			amount: Math.min(10, 5 + level),
		});
		this.createInvadersRow({
			type: 1, // 外形二
			x: 70,
			y: 200,
			amount: Math.min(10, 4 + level),
		});
		this.createInvadersRow({
			type: 2, // 外形三
			x: 100,
			y: 160,
			amount: Math.min(10, 3 + level),
		});
		let boss = new InvaderBoss(this, 220, 120);
		this.invaders.push(boss);
	}
	/**
	 * 關卡開始
	 */
	async startLevel(level: number) {
		this.level = level;
		// 關卡開始動畫
		await this.ui.showLevel(level)
		// 重建地球護盾
		this.resetShields();
		// 建立侵略者大軍
		this.createInvadersAll(level);
		// 設定關卡難度
		this.invadersMoveInterval = Math.max(10, 21 - level);
		this.invadersShootInterval = Math.max(30, 91 - level);
	}
	private resetShields() {
		// 將現有的護盾都移除
		this.shields.forEach((shield) => shield.destroy());
		this.shields.length = 0;
		// 定義所有護盾小方塊的位置
		let positions = [
			// 左邊護盾
			new Point(100, 410),
			new Point(120, 400),
			new Point(140, 400),
			new Point(160, 410),
			// 中間護盾
			new Point(300, 410),
			new Point(320, 400),
			new Point(340, 400),
			new Point(360, 410),
			// 右邊護盾
			new Point(500, 410),
			new Point(520, 400),
			new Point(540, 400),
			new Point(560, 410),
		];
		// 建立新護盾
		for (let pos of positions) {
			let shield = new EarthShield(this, pos.x, pos.y);
			this.app.stage.addChild(shield);
			this.shields.push(shield);
		}
	}
}
