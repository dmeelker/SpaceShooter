import { EntityComponentSystem } from "./ecs/EntityComponentSystem";
import { AnimationRepository } from "./utilities/Animation";
import { FrameTime } from "./utilities/FrameTime";
import { Images } from "./utilities/Images";
import { Rectangle, Point } from "./utilities/Trig";

export interface IGameContext {
    readonly time: FrameTime;
    readonly canvas: HTMLCanvasElement;
    readonly renderContext: CanvasRenderingContext2D;
    readonly viewSize: Rectangle;
    readonly images: Images;
    readonly ecs: EntityComponentSystem;
    readonly animations: AnimationRepository;

    levelToScreenCoordinates(levelCoordinates: Point): Point;
}