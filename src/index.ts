import { Images } from "./utilities/Images";
import { FrameCounter } from "./utilities/FrameCounter";
import { Keyboard } from "./utilities/Keyboard";
import { EntityComponentSystem, EntityId } from "./game/ecs/EntityComponentSystem";
import * as RenderSystem from "./game/ecs/systems/RenderSystem";
import * as MovementSystem from "./game/ecs/systems/MovementSystem";
import * as ProjectileSystem from "./game/ecs/systems/ProjectileSystem";
import * as ShipControllerSystem from "./game/ecs/systems/ShipControllerSystem";
import * as EntityCleanupSystem from "./game/ecs/systems/EntityCleanupSystem"
import * as TimedDestroySystem from "./game/ecs/systems/TimedDestroySystem"
import * as SeekingTargetSystem from "./game/ecs/systems/SeekingTargetSystem"
import PixelFontSmall from "./fonts/PixelFontSmall"
import PixelFontMedium from "./fonts/PixelFontMedium"
import { Point, Rectangle, Vector } from "./utilities/Trig";
import { FrameTime } from "./utilities/FrameTime";
import { createAsteroid, createPlayerShip, createProjectile } from "./game/ecs/EntityFactory";
import { SpriteSheetLoader } from "./utilities/SpriteSheetLoader";
import { IGameContext } from "./GameContext";
import { ProjectileType } from "./game/ecs/components/ProjectileComponent";
import { Timer } from "./utilities/Timer";
import { StarField } from "./game/StarField";
import { EnemyGenerator } from "./game/EnemyGenerator";
import { AnimationDefinition, AnimationRepository } from "./utilities/Animation";
import { PlayerScore } from "./game/PlayerScore";
import { Font, prepareFont } from "./utilities/Font";

class GameContext implements IGameContext {
    public time: FrameTime;
    public canvas: HTMLCanvasElement;
    public renderContext: CanvasRenderingContext2D;
    public viewSize: Rectangle;
    public readonly images = new Images();
    public readonly ecs = new EntityComponentSystem();
    public readonly animations = new AnimationRepository();
    public playerId: EntityId;
    public readonly score = new PlayerScore();
    public smallFont: Font;
    public mediumFont: Font;

    public levelToScreenCoordinates(levelCoordinates: Point): Point {
        return new Point(
            this.viewSize.size.width * (levelCoordinates.x / 100),
            this.viewSize.size.height * (levelCoordinates.y / 100))
    }
}

const context = new GameContext();

const frameCounter = new FrameCounter();
const keyboard = new Keyboard();
let enemyGenerator: EnemyGenerator;
let starFields : Array<StarField>;

let shipSpeed = 200;
const fireTimer = new Timer(200);

let lastFrameTime = 0;

const hpLabel = document.getElementById("hpLabel");

async function main() {
    await initialize();

    window.requestAnimationFrame(processFrame);
}

async function initialize() {
    initializeGameContext();
    await loadImages();
    setupAnimations();
    loadFonts();

    resetGame();
}

function initializeGameContext() {
    context.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    context.renderContext = context.canvas.getContext("2d");
    context.viewSize = new Rectangle(0, 0, context.canvas.width, context.canvas.height);

    starFields = [new StarField(context.viewSize.size, 20, 1300), new StarField(context.viewSize.size, 25, 1300), new StarField(context.viewSize.size, 30, 1300)];
}

async function loadImages() {
    await context.images.load("ship", "gfx/ship.png");
    await context.images.load("shot", "gfx/shot.png");
    await context.images.load("explosion", "gfx/explosion.png");
    await context.images.load("asteroid", "gfx/asteroid.png");
    await context.images.load("pixelfont-small", "gfx/pixelfont-small.png");
    await context.images.load("pixelfont-medium", "gfx/pixelfont-medium.png");
}

async function setupAnimations() {
    await createAnimationFromImage("explosion", 6, 1, 50);
}

async function createAnimationFromImage(code: string, horizontalSprites: number, verticalSprites: number, animationSpeed: number) {
    const image = context.images.get(code);
    const frames = await new SpriteSheetLoader().cutSpriteSheet(image, horizontalSprites, verticalSprites);

    context.animations.add(code, new AnimationDefinition(frames, animationSpeed));
}

function loadFonts() {
    context.smallFont = prepareFont(PixelFontSmall, context.images.get("pixelfont-small"));
    context.mediumFont = prepareFont(PixelFontMedium, context.images.get("pixelfont-medium"));
}

function resetGame() {
    context.ecs.clear();
    context.score.reset();
    enemyGenerator = new EnemyGenerator();
    context.playerId = createPlayerShip(context, context.levelToScreenCoordinates(new Point(5, 50)));

    createAsteroid(context, context.levelToScreenCoordinates(new Point(100, 50)));
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
    checkPlayerDestroyed();
    handleInput(time);
    updateUi();

    starFields.forEach(field => field.update(time));
    enemyGenerator.update(context);
    //levelProgress.update(time, context);
    ShipControllerSystem.update(context);
    MovementSystem.update(context);
    ProjectileSystem.update(context);
    SeekingTargetSystem.update(context);
    TimedDestroySystem.update(context);
    EntityCleanupSystem.update(context);
    context.ecs.removeDisposedEntities();

    keyboard.nextFrame();
}

function checkPlayerDestroyed() {
    const dimensions = context.ecs.components.dimensionsComponents.get(context.playerId);

    if(dimensions == undefined) {
        resetGame();
    }
}

function handleInput(time: FrameTime) {
    const dimensions = context.ecs.components.dimensionsComponents.get(context.playerId);
    let location = dimensions.bounds.location;

    if (keyboard.isButtonDown("ArrowLeft")) {
        location.x -= time.calculateMovement(shipSpeed);
    }
    if (keyboard.isButtonDown("ArrowRight")) {
        location.x += time.calculateMovement(shipSpeed);
    }
    if (keyboard.isButtonDown("ArrowUp")) {
        location.y -= time.calculateMovement(shipSpeed);
    }
    if (keyboard.isButtonDown("ArrowDown")) {
        location.y += time.calculateMovement(shipSpeed);
    }

    if(location.x < 0) location.x = 0;
    if(location.x + dimensions.bounds.size.width > context.viewSize.size.width) location.x = context.viewSize.size.width - dimensions.bounds.size.width;
    if(location.y < 0) location.y = 0;
    if(location.y + dimensions.bounds.size.height > context.viewSize.size.height) location.y = context.viewSize.size.height - dimensions.bounds.size.height;

    if((fireTimer.update(time.currentTime) && keyboard.isButtonDown("Space")) || keyboard.wasButtonPressedInFrame("Space")) {
        const tankBounds = context.ecs.components.dimensionsComponents.get(context.playerId).bounds;

        //createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(-25).multiplyScalar(500), ProjectileType.player);
        createProjectile(context, tankBounds.location, Vector.fromDegreeAngle(0).multiplyScalar(500), ProjectileType.player);
        //createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(25).multiplyScalar(500), ProjectileType.player);
    }
}

function updateUi() {
    const ship = context.ecs.components.projectileTargetComponents.get(context.playerId);
    hpLabel.innerText = `HP: ${ship.hitpoints.toString()} Score: ${context.score.points}`;
}

function render() {
    context.renderContext.beginPath();
    context.renderContext.fillStyle = "black";
    context.renderContext.fillRect(0, 0, context.canvas.width, context.canvas.height);

    starFields.forEach(field => field.render(context.renderContext));
    RenderSystem.render(context.ecs, context.renderContext);

    const ship = context.ecs.components.projectileTargetComponents.get(context.playerId);
    context.smallFont.render(context.renderContext, new Point(5, context.viewSize.size.height - context.smallFont.LineHeight - 5),  `HP: ${ship.hitpoints.toString()} Score: ${context.score.points}`);
}

main();