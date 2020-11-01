import { Images } from "./utilities/Images";
import { FrameCounter } from "./utilities/FrameCounter";
import PixelFontSmall from "./fonts/PixelFontSmall"
import PixelFontMedium from "./fonts/PixelFontMedium"
import { Point, Rectangle } from "./utilities/Trig";
import { FrameTime } from "./utilities/FrameTime";
import { SpriteSheetLoader } from "./utilities/SpriteSheetLoader";
import { AnimationDefinition, AnimationRepository } from "./utilities/Animation";
import { Font, prepareFont } from "./utilities/Font";
import { ScreenManager } from "./utilities/ScreenManager";
import { IntroScreen } from "./IntroScreen";
import { PlayScreen } from "./PlayScreen";
import { GameState } from "./game/GameState";
import { Keyboard } from "./utilities/Keyboard";

export class ViewInfo {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public size: Rectangle;
    public scale: number = 2;

    public levelToScreenCoordinates(levelCoordinates: Point): Point {
        return new Point(
            this.size.size.width * (levelCoordinates.x / 100),
            this.size.size.height * (levelCoordinates.y / 100))
    }
}

export class Fonts {
    public small: Font;
    public medium: Font;
}

export class Game {
    public time: FrameTime;

    public readonly view = new ViewInfo();
    public readonly images = new Images();
    public readonly animations = new AnimationRepository();
    public readonly fonts = new Fonts();
    public readonly keyboard = new Keyboard();

    public introScreen: IntroScreen;
    public playScreen: PlayScreen;
    public screenManager: ScreenManager;

    public state = new GameState();

    private readonly _frameCounter = new FrameCounter();
    private _lastFrameTime = 0;

    public async start() {
        await this.initialize();
        this.requestAnimationFrame();
    }
 
    async initialize() {
        this.initializeGameContext();
        await this.loadImages();
        this.setupAnimations();
        this.loadFonts();
        this.intializeScreens();
    }

    private initializeGameContext() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.style.width = (canvas.width * this.view.scale) + "px";
        canvas.style.height = (canvas.height * this.view.scale) + "px";
        canvas.style.imageRendering = "pixelated";

        this.view.canvas = canvas;
        this.view.context = canvas.getContext("2d");
        this.view.size = new Rectangle(0, 0, canvas.width, canvas.height);
    }

    private async loadImages() {
        await this.images.load("ship", "gfx/ship.png");
        await this.images.load("shot", "gfx/shot.png");
        await this.images.load("explosion", "gfx/explosion.png");
        await this.images.load("asteroid", "gfx/asteroid.png");
        await this.images.load("pixelfont-small", "gfx/pixelfont-small.png");
        await this.images.load("pixelfont-medium", "gfx/pixelfont-medium.png");
    }

    private async setupAnimations() {
        await this.createAnimationFromImage("explosion", 6, 1, 50);
    }

    private async createAnimationFromImage(code: string, horizontalSprites: number, verticalSprites: number, animationSpeed: number) {
        const image = this.images.get(code);
        const frames = await new SpriteSheetLoader().cutSpriteSheet(image, horizontalSprites, verticalSprites);

        this.animations.add(code, new AnimationDefinition(frames, animationSpeed));
    }

    private loadFonts() {
        this.fonts.small = prepareFont(PixelFontSmall, this.images.get("pixelfont-small"));
        this.fonts.medium = prepareFont(PixelFontMedium, this.images.get("pixelfont-medium"));
    }

    private intializeScreens() {
        this.introScreen = new IntroScreen(this);
        this.playScreen = new PlayScreen(this);
        this.screenManager = new ScreenManager(this.introScreen);
    }

    private requestAnimationFrame() {
        window.requestAnimationFrame(this.processFrame.bind(this));
    }

    private processFrame(time: number) {
        this.time = this.updateFrameTime(time);

        this.update(this.time);
        this.render();

        this._frameCounter.frame();
        this.requestAnimationFrame();
    }

    private updateFrameTime(time: number) {
        const frameTime = new FrameTime(time, time - this._lastFrameTime);
        this._lastFrameTime = time;

        return frameTime;
    }

    private update(time: FrameTime) {
        this.screenManager.activeScreen.update(time);
        this.keyboard.nextFrame();
    }

    private render() {
        this.view.context.beginPath();
        this.view.context.fillStyle = "black";
        this.view.context.fillRect(0, 0, this.view.size.width, this.view.size.height);

        this.screenManager.activeScreen.render(this.view.context);
    }
}

new Game().start();