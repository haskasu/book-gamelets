import { EventEmitter } from "eventemitter3";

export class KeyboardManager extends EventEmitter {
	/**
	 * 記錄每個鍵是否在按下去的狀態
	 */
	private isKeyDownMap: { [key: string]: boolean } = {};
	/**
	 * 提供遊戲函式檢查某個鍵是否在按下去的狀態
	 */
	isKeyDown(key: string): boolean {
		return this.isKeyDownMap[key];
	}

	constructor() {
		super();
		this.listenToEvents();
	}
	private listenToEvents(): void {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}
	/**
	 * 在鍵盤按下去時的處理函式
	 * @param event window發出來的事件
	 */
	private onKeyDown = (event: KeyboardEvent) => {
		this.emit('keydown', event);

		if (!this.isKeyDown(event.code)) {
			this.isKeyDownMap[event.code] = true;
			this.emit('pressed', event);
		}
	}
	/**
	 * 在放開鍵盤上的鍵時的處理函式
	 * @param event window發出來的事件
	 */
	private onKeyUp = (event: KeyboardEvent) => {
		this.emit('keyup', event);

		if (this.isKeyDown(event.code)) {
			this.isKeyDownMap[event.code] = false;
			this.emit('released', event);
		}
	}
	/**
	 * 等待鍵盤按鍵被玩家按下去
	 */
	async waitUserPressKey(keyCode: string) {
		// 建立Promise，從參數函式裏取得resolve函式
		return new Promise<void>((resolve) => {
			// 宣告有按鍵被按下去的回呼函式
			let onPress = (event: KeyboardEvent) => {
				// 如果按鍵是我們正在等的
				if (event.code == keyCode) {
					// 取消pressed事件的監聽
					this.off('pressed', onPress);
					// 兌現承諾
					resolve();
				}
			};
			// 監聽pressed事件
			this.on('pressed', onPress);
		});
	}
	/**
	 * 等待鍵盤按鍵被玩家放開
	 */
	async waitUserReleaseKey(keyCode: string) {
		// 建立Promise，從參數函式裏取得resolve函式
		return new Promise<void>((resolve) => {
			// 宣告有按鍵被放開的回呼函式
			let onRelease = (event: KeyboardEvent) => {
				// 如果按鍵是我們正在等的
				if (event.code == keyCode) {
					// 取消released事件的監聽
					this.off('released', onRelease);
					// 兌現承諾
					resolve();
				}
			};
			// 監聽released事件
			this.on('released', onRelease);
		});
	}
}

export const keyboardManager = new KeyboardManager();