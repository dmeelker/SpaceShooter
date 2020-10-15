import { createShip } from "./ecs/EntityFactory";
import { IGameContext } from "./GameContext";
import { FrameTime } from "./utilities/FrameTime";
import { Vector } from "./utilities/Trig";

export type LevelSpec = Array<ILevelWave>;

export interface ILevelWave {
    progress: number;
    enemies: Array<ILevelEnemy>
}

export interface ILevelEnemy {
    y: number;
    speed: number;
    angle?: number;
}

export class LevelProgressManager {
    private _level: LevelSpec;
    private _progress: number;

    public constructor(level: LevelSpec) {
        this._level = level;
        this._progress = 0;
    }

    public update(time: FrameTime, context: IGameContext) {
        const waves = this._level.filter(wave => wave.progress > this._progress && wave.progress < this._progress + time.timeSinceLastFrame);

        for(let wave of waves) {
           this.spawnWave(wave, context); 
        }

        this._progress += time.timeSinceLastFrame;
    }

    private spawnWave(wave: ILevelWave, context: IGameContext) {
        for(let enemy of wave.enemies) {
            const location = {x: context.viewSize.size.width, y: context.viewSize.size.height * (enemy.y / 100)};
            const angle = enemy.angle ?? 180;
            const vector = Vector.fromDegreeAngle(angle).multiplyScalar(enemy.speed);

            createShip(context.ecs, context.images, location, vector);
        }
    }
}