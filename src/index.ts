import { Images } from "./utilities/Images";
import { FrameCounter } from "./utilities/FrameCounter";
import { Keyboard } from "./utilities/Keyboard";
import { EntityComponentSystem, EntityId } from "./ecs/EntityComponentSystem";
import * as RenderSystem from "./ecs/systems/RenderSystem";
import * as MovementSystem from "./ecs/systems/MovementSystem";
import * as ProjectileSystem from "./ecs/systems/ProjectileSystem";
import * as ShipControllerSystem from "./ecs/systems/ShipControllerSystem";
import * as EntityCleanupSystem from "./ecs/systems/EntityCleanupSystem"
import { DimensionsComponent } from "./ecs/components/DimensionsComponent";
import { Point, Rectangle, Vector } from "./utilities/Trig";
import { RenderComponent } from "./ecs/components/RenderComponent";
import { FrameTime } from "./utilities/FrameTime";
import { VelocityComponent } from "./ecs/components/VelocityComponent";
import { createPlayerShip, createProjectile, createShip } from "./ecs/EntityFactory";
import { SpriteSheetLoader } from "./utilities/SpriteSheetLoader";
import { IGameContext } from "./GameContext";
import { ProjectileType } from "./ecs/components/ProjectileComponent";
import { Timer } from "./utilities/Timer";
import { LevelProgressManager } from "./Levels";
import Level1 from "./levels/Level1";
import { StarField } from "./StarField";

class GameContext implements IGameContext {
    public time: FrameTime;
    public canvas: HTMLCanvasElement;
    public renderContext: CanvasRenderingContext2D;
    public viewSize: Rectangle;
    public readonly images = new Images();
    public readonly ecs = new EntityComponentSystem();
}
const context = new GameContext();

let tankId: EntityId;
context.canvas = document.getElementById("canvas") as HTMLCanvasElement;
context.renderContext = context.canvas.getContext("2d");
context.viewSize = new Rectangle(0, 0, context.canvas.width, context.canvas.height);

let levelProgress: LevelProgressManager;
let starField = new StarField(context.viewSize.size);

const frameCounter = new FrameCounter();
const keyboard = new Keyboard();
let lastFrameTime = 0;

const fireTimer = new Timer(200);

async function main() {
    await initialize();

    window.requestAnimationFrame(processFrame);
}

async function initialize() {
    await loadImages();

    levelProgress = new LevelProgressManager(Level1);
    tankId = createPlayerShip(context, new Point(10, 10));
}

async function loadImages() {
    await context.images.load("ship", "gfx/ship.png");
    await context.images.load("shot", "gfx/shot.png");
    await context.images.load("shipsheet", "gfx/16ShipCollectionPRE2.png");

    const sheet = context.images.get("shipsheet");
    const ships = await new SpriteSheetLoader().cutSpriteSheet(sheet, 10, 10);
}

function processFrame(time: number) {
    context.time = updateFrameTime(time);

    update(context.time);
    render();

    frameCounter.frame();
    window.requestAnimationFrame(processFrame)
}

function updateFrameTime(time: number) {
    const frameTime = new FrameTime(time, time - lastFrameTime);
    lastFrameTime = time;

    return frameTime;
}

function update(time: FrameTime) {
    handleInput(time);

    starField.update(time);
    levelProgress.update(time, context);
    ShipControllerSystem.update(context);
    MovementSystem.update(context);
    ProjectileSystem.update(context);
    EntityCleanupSystem.update(context);
    context.ecs.removeDisposedEntities();

    keyboard.nextFrame();
}

function handleInput(time: FrameTime) {
    const dimensions = context.ecs.components.dimensionsComponents.get(tankId);
    let location = dimensions.bounds.location;

    if (keyboard.isButtonDown("ArrowLeft")) {
        location.x -= time.calculateMovement(100);
    }
    if (keyboard.isButtonDown("ArrowRight")) {
        location.x += time.calculateMovement(100);
    }
    if (keyboard.isButtonDown("ArrowUp")) {
        location.y -= time.calculateMovement(100);
    }
    if (keyboard.isButtonDown("ArrowDown")) {
        location.y += time.calculateMovement(100);
    }

    if(fireTimer.update(time.currentTime) && keyboard.isButtonDown("Space")) {
        const tankBounds = context.ecs.components.dimensionsComponents.get(tankId).bounds;

        //createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(-25).multiplyScalar(500), ProjectileType.player);
        createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(0).multiplyScalar(500), ProjectileType.player);
        //createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(25).multiplyScalar(500), ProjectileType.player);
    }
}

function render() {
    context.renderContext.beginPath();
    context.renderContext.fillStyle = "black";
    context.renderContext.fillRect(0, 0, context.canvas.width, context.canvas.height);

    starField.render(context.renderContext);

    RenderSystem.render(context.ecs, context.renderContext);

    // context.renderContext.font = '12px sans-serif';
    // context.renderContext.fillStyle = "white";
    // context.renderContext.fillText('Hello world', 10, 50);
}

main();