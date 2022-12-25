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

		if (!this.isKeyDown(event.key)) {
			this.isKeyDownMap[event.key] = true;
			this.emit('pressed', event);
		}
	}
	/**
	 * 在放開鍵盤上的鍵時的處理函式
	 * @param event window發出來的事件
	 */
	private onKeyUp = (event: KeyboardEvent) => {
		this.emit('keyup', event);

		if (this.isKeyDown(event.key)) {
			this.isKeyDownMap[event.key] = false;
			this.emit('released', event);
		}
	}
}

export const keyboardManager = new KeyboardManager();