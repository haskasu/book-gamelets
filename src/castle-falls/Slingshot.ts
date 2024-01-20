import { Body, Composite, Constraint, Events, Mouse, MouseConstraint, Vector } from "matter-js";
import { ICFSlingshot } from "./CastleFallsLevelData";
import { Sprite } from "pixi.js";
import { wait } from "../main";
import { CastleFallsGame } from "./CastleFallsGame";
import slingshotImg from "../images/slingshot.png";
import slingshotFrontImg from "../images/slingshot_front.png";
import shootSnd from "../sounds/missile-launch.mp3";
import { playSound } from "../lib/SoundUtils";

export class Slingshot {

    bandSprites: Sprite[] = [];

    // 石頭上膛後，記錄石頭與橡皮筋的資料
    shootData?: {
        rock: Body,
        elastic: Constraint,
        releaseStart?: Vector,
    };

    constructor(public game: CastleFallsGame, public data: ICFSlingshot) {
        // 建立彈弓的精靈圖
        this.createSprites(data);
        // 將石頭上膛
        this.loadRock();
        // 建立滑鼠約束，讓玩家可以用滑鼠拉石頭
        let mouseConstraint = this.createMouseConstraint();
        // 將橡皮筋、滑鼠約束都加進物理世界
        Composite.add(game.engine.world, mouseConstraint);
        // 監聽滑鼠約束被鬆開的事件
        Events.on(mouseConstraint, 'enddrag', this.onMouseEndDrag);
    }
    private onMouseEndDrag = async () => {
        if (this.shootData) {
            // 改變石頭的類別
            const rock = this.shootData.rock;
            rock.collisionFilter.category = 0b01;
            // 記錄發射石頭的出發點(S點)
            this.shootData.releaseStart = Vector.clone(rock.position);
            // 播放發射音效
            playSound(shootSnd);
            // 等待石頭飛得夠遠
            await this.waitRockBackToAPoint();
            // 移除白色橡皮筋
            Composite.remove(
                this.game.engine.world,
                this.shootData.elastic
            );
            // 清除石塊上膛資料
            this.shootData = undefined;
            // 等待世界睡著
            await this.game.waitWorldPeace();
            // 將新石頭上膛
            this.loadRock();
        }
    }
    // 等待石頭從滑鼠飛至彈弓的A點
    private async waitRockBackToAPoint() {
        if (this.shootData && this.shootData.releaseStart) {
            let start = this.shootData.releaseStart;
            let rock = this.shootData.rock;
            let elastic = this.shootData.elastic;
            // 建立石頭到滑鼠(S點)的向量
            let vector = Vector.sub(rock.position, start);
            // 建立彈弓A點到滑鼠(S點)的向量
            let endVector = Vector.sub(elastic.pointA, start);
            // 檢查石頭到滑鼠的距離是否還未超過彈弓A點到滑鼠的距離
            if (Vector.magnitude(vector) < Vector.magnitude(endVector)) {
                // 若還沒超過要切斷的距離，就等一個tick再檢查一次
                await wait(1);
                await this.waitRockBackToAPoint();
            }
        }
    }
    private loadRock(): void {
        const data = this.data;
        // 建一顆石頭
        let rock = this.createRock(data);
        // 橡皮筋
        let elastic = this.createElastic(data, rock);
        Composite.add(this.game.engine.world, elastic);
        // 儲存這次上膛的資料
        this.shootData = {
            rock: rock,
            elastic: elastic,
        };
    }
    private createSprites(data: ICFSlingshot): void {
        // 彈弓主體
        let backSprite = Sprite.from(slingshotImg);
        backSprite.zIndex = 0;
        backSprite.position.set(data.x - 35, data.y - 15);
        this.game.addChild(backSprite);
        // 能遮住石塊的木段
        let frontSprite = Sprite.from(slingshotFrontImg);
        frontSprite.zIndex = 10;
        frontSprite.position.copyFrom(backSprite.position);
        this.game.addChild(frontSprite);

    }
    private createRock(data: ICFSlingshot): Body {
        let object = this.game.createMatterObject({
            type: 'rock',
            x: data.x,
            y: data.y + 1,
            circle: {
                radius: 15,
            },
        });
        return object.body;
    }
    private createElastic(data: ICFSlingshot, rock: Body): Constraint {
        return Constraint.create({
            pointA: { x: data.x, y: data.y }, //一端固定在一點
            bodyB: rock, // 另一端綁在石頭上
            stiffness: data.stiffness, // 剛性程度
        });
    }
    private createMouseConstraint(): MouseConstraint {
        let canvas = this.game.app.view as HTMLCanvasElement;
        // 建立Matter滑鼠，使用Pixi畫板接收滑鼠事件
        let mouse = Mouse.create(canvas);
        // 調整Matter滑鼠的位置 
        let stage = this.game.gameApp.app.stage;
        mouse.offset.x = -stage.x / stage.scale.x;
        mouse.offset.y = -stage.y / stage.scale.y;
        mouse.scale.x = 1 / stage.scale.x;
        mouse.scale.y = 1 / stage.scale.y;
        // 建立滑鼠約束
        return MouseConstraint.create(this.game.engine, {
            mouse: mouse,
            collisionFilter: {
                mask: 0b10,
            }
        });
    }
}
