export interface ICastleFallsLevelData {
	slingshot: ICFSlingshot;
	objects: ICFObject[];
}

export interface ICFSlingshot {
	x: number;
	y: number;
	stiffness: number; // 橡皮筋的剛性程度
}

export interface ICFObject {
	type: string; // 物體類別
	x: number;
	y: number;
	angleDeg?: number; // 旋轉角度
	rect?: { // 若是矩形則定義這筆資料
		width: number;
		height: number;
	},
	circle?: { // 若是圓形則定義這筆資料
		radius: number;
	},
}

// 匯出物體類別對應物理性質的通用物件
export const BodyOptionsMap: { [key: string]: Matter.IBodyDefinition } = {
	ground: {
		isStatic: true,
		friction: 1,
		render: {
			fillStyle: 'transparent',
			strokeStyle: '#000000',
			lineWidth: 3,
		},
	},
	brick: {
		density: 0.1,
		friction: 0.5,
		render: {
			fillStyle: 'transparent',
			strokeStyle: '#FFFF00',
			lineWidth: 3,
		},
	},
	boss: {
		density: 0.1,
		friction: 0.5,
		render: {
			fillStyle: 'transparent',
			strokeStyle: '#ff0000',
			lineWidth: 3,
		},
	},
	rock: {
		density: 0.1,
		friction: 0.5,
		render: {
			fillStyle: 'transparent',
			strokeStyle: '#ffFFFF',
			lineWidth: 3,
		},
		collisionFilter: {
			category: 0b11,
		}
	},
};