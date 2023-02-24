export interface LevelRecord {
    cleared: boolean;
}

export class CastleFallsRecord {

    private levelRecords: { [key: string]: LevelRecord } = {}

    constructor() {
        this.load();
    }
    // 讀取先前的遊戲記錄
    private load(): void {
        let rawData = localStorage.getItem('cfRecords');
        if (rawData) {
            this.levelRecords = JSON.parse(rawData);
        } else {
            this.levelRecords = {};
        }
    }
    // 儲存遊戲記錄
    private save(): void {
        let rawData = JSON.stringify(this.levelRecords);
        localStorage.setItem('cfRecords', rawData);
    }
    // 記錄關卡
    public setLevelRecord(level: number, record: LevelRecord): void {
        this.levelRecords[level] = record;
        this.save();
    }
    // 檢查某關是否已通關
    isLevelCleared(level: number): boolean {
        let record = this.levelRecords[level];
        return record && record.cleared;
    }
    // 檢查某關是否已解鎖
    isLevelUnlocked(level: number): boolean {
        return level == 1 || this.isLevelCleared(level - 1);
    }
}
