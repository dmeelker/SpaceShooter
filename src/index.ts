import { Images } from "./utilities/Images";
import { FrameCounter } from "./utilities/FrameCounter";
import { EntityComponentSystem, EntityId } from "./game/ecs/EntityComponentSystem";
import PixelFontSmall from "./fonts/PixelFontSmall"
import PixelFontMedium from "./fonts/PixelFontMedium"
import { Point, Rectangle, Vector } from "./utilities/Trig";
import { FrameTime } from "./utilities/FrameTime";
import { SpriteSheetLoader } from "./utilities/SpriteSheetLoader";
import { IGameContext } from "./GameContext";
import { AnimationDefinition, AnimationRepository } from "./utilities/Animation";
import { PlayerScore } from "./game/PlayerScore";
import { Font, prepareFont } from "./utilities/Font";
import { Ui } from "./utilities/UI";
import { ScreenManager } from "./utilities/ScreenManager";
import { IntroScreen } from "./IntroScreen";
import { PlayScreen } from "./PlayScreen";

class GameContext implements IGameContext {
    public time: FrameTime;
    public canvas: HTMLCanvasElement;
    public renderContext: CanvasRenderingContext2D;
    public viewSize: Rectangle;
    public readonly images = new Images();
    public readonly ecs = new EntityComponentSystem();
    public readonly animations = new AnimationRepository();

    public introScreen: IntroScreen;
    public playScreen: PlayScreen;
    public screenManager: ScreenManager;


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
const viewScale = 2;
const frameCounter = new FrameCounter();

let lastFrameTime = 0;

const hpLabel = document.getElementById("hpLabel");

const ui = new Ui();

async function main() {
    await initialize();

    window.requestAnimationFrame(processFrame);
}

async function initialize() {
    initializeGameContext();
    await loadImages();
    setupAnimations();
    loadFonts();
    intializeScreens();
}

function initializeGameContext() {
    context.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    context.renderContext = context.canvas.getContext("2d");
    context.viewSize = new Rectangle(0, 0, context.canvas.width, context.canvas.height);
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

    ui.defaultFont = context.smallFont;
}

function intializeScreens() {
    context.introScreen = new IntroScreen(context);
    context.playScreen = new PlayScreen(context);
    context.screenManager = new ScreenManager(context.introScreen);
}

function processFrame(time: number) {
    context.time = updateFrameTime(time);

    update(context.time);
    render();
    ui.frameDone();

    frameCounter.frame();
    window.requestAnimationFrame(processFrame)
}

function updateFrameTime(time: number) {
    const frameTime = new FrameTime(time, time - lastFrameTime);
    lastFrameTime = time;

    return frameTime;
}

function update(time: FrameTime) {
    context.screenManager.activeScreen.update(time);
}

function render() {
    context.renderContext.beginPath();
    context.renderContext.fillStyle = "black";
    context.renderContext.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.screenManager.activeScreen.render(context.renderContext);
}

main();