import { Application } from "pixi.js";
import { PlayerCannon } from "./PlayerCannon";

export class SpaceInvadersGame {

	cannon: PlayerCannon;

	constructor(public app: Application) {
		this.cannon = new PlayerCannon(this);
	}
}
