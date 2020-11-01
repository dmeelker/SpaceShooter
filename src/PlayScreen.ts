import { createAsteroid, createPlayerShip, createProjectile } from "./game/ecs/EntityFactory";
import { EnemyGenerator } from "./game/EnemyGenerator";
import { StarField } from "./game/StarField";
import { IGameContext } from "./GameContext";
import { FrameTime } from "./utilities/FrameTime";
import { IScreen } from "./utilities/ScreenManager";
import { Timer } from "./utilities/Timer";
import { Point, Vector } from "./utilities/Trig";
import { DomUiEventProvider, Ui } from "./utilities/UI";
import * as RenderSystem from "./game/ecs/systems/RenderSystem";
import * as MovementSystem from "./game/ecs/systems/MovementSystem";
import * as ProjectileSystem from "./game/ecs/systems/ProjectileSystem";
import * as ShipControllerSystem from "./game/ecs/systems/ShipControllerSystem";
import * as EntityCleanupSystem from "./game/ecs/systems/EntityCleanupSystem"
import * as TimedDestroySystem from "./game/ecs/systems/TimedDestroySystem"
import * as SeekingTargetSystem from "./game/ecs/systems/SeekingTargetSystem"
import { Keyboard } from "./utilities/Keyboard";
import { ProjectileType } from "./game/ecs/components/ProjectileComponent";

export class PlayScreen implements IScreen {
    private readonly _gameContext: IGameContext;
    private readonly _ui = new Ui();
    private readonly _uiInputProvider;

    private enemyGenerator: EnemyGenerator;
    private starFields : Array<StarField>;

    private keyboard = new Keyboard();

    private shipSpeed = 200;
    private fireTimer = new Timer(200);

    public constructor(gameContext: IGameContext) {
        this._gameContext = gameContext;
        this._uiInputProvider = new DomUiEventProvider(this._ui, gameContext.canvas);

        this.starFields = [new StarField(gameContext.viewSize.size, 20, 1300), new StarField(gameContext.viewSize.size, 25, 1300), new StarField(gameContext.viewSize.size, 30, 1300)];
    }

    onActivate(): void {
        this._uiInputProvider.hook();
        this.resetGame();
    }

    onDeactivate(): void {
        this._uiInputProvider.unhook();
    }

    update(time: FrameTime): void {
        this.starFields.forEach(field => field.update(time));

        this.handleInput(time);

        this.enemyGenerator.update(this._gameContext);
        ShipControllerSystem.update(this._gameContext);
        MovementSystem.update(this._gameContext);
        ProjectileSystem.update(this._gameContext);
        SeekingTargetSystem.update(this._gameContext);
        TimedDestroySystem.update(this._gameContext);
        EntityCleanupSystem.update(this._gameContext);
        this._gameContext.ecs.removeDisposedEntities();

        this.checkPlayerDestroyed();
        this.keyboard.nextFrame();
    }

    render(renderContext: CanvasRenderingContext2D): void {
        this.starFields.forEach(field => field.render(renderContext));
        RenderSystem.render(this._gameContext.ecs, renderContext);
    
        const ship = this._gameContext.ecs.components.projectileTargetComponents.get(this._gameContext.playerId);
        this._gameContext.smallFont.render(renderContext, new Point(5, this._gameContext.viewSize.size.height - this._gameContext.smallFont.LineHeight - 5),  `HP: ${ship.hitpoints.toString()} Score: ${this._gameContext.score.points}`);

        this._ui.frameDone();   
    }

    private resetGame() {
        this._gameContext.ecs.clear();
        this._gameContext.score.reset();
        this.enemyGenerator = new EnemyGenerator();
        this._gameContext.playerId = createPlayerShip(this._gameContext, this._gameContext.levelToScreenCoordinates(new Point(5, 50)));
    
        createAsteroid(this._gameContext, this._gameContext.levelToScreenCoordinates(new Point(100, 50)));
    }

    private handleInput(time: FrameTime) {
        const dimensions = this._gameContext.ecs.components.dimensionsComponents.get(this._gameContext.playerId);
        let location = dimensions.bounds.location;
    
        if (this.keyboard.isButtonDown("ArrowLeft")) {
            location.x -= time.calculateMovement(this.shipSpeed);
        }
        if (this.keyboard.isButtonDown("ArrowRight")) {
            location.x += time.calculateMovement(this.shipSpeed);
        }
        if (this.keyboard.isButtonDown("ArrowUp")) {
            location.y -= time.calculateMovement(this.shipSpeed);
        }
        if (this.keyboard.isButtonDown("ArrowDown")) {
            location.y += time.calculateMovement(this.shipSpeed);
        }
    
        if(location.x < 0) location.x = 0;
        if(location.x + dimensions.bounds.size.width > this._gameContext.viewSize.size.width) location.x = this._gameContext.viewSize.size.width - dimensions.bounds.size.width;
        if(location.y < 0) location.y = 0;
        if(location.y + dimensions.bounds.size.height > this._gameContext.viewSize.size.height) location.y = this._gameContext.viewSize.size.height - dimensions.bounds.size.height;
    
        if((this.fireTimer.update(time.currentTime) && this.keyboard.isButtonDown("Space")) || this.keyboard.wasButtonPressedInFrame("Space")) {
            const tankBounds = this._gameContext.ecs.components.dimensionsComponents.get(this._gameContext.playerId).bounds;
    
            //createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(-25).multiplyScalar(500), ProjectileType.player);
            createProjectile(this._gameContext, tankBounds.location, Vector.fromDegreeAngle(0).multiplyScalar(500), ProjectileType.player);
            //createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(25).multiplyScalar(500), ProjectileType.player);
        }
    }

    private checkPlayerDestroyed() {
        const dimensions = this._gameContext.ecs.components.dimensionsComponents.get(this._gameContext.playerId);
    
        if(dimensions == undefined) {
            this.resetGame();
        }
    }
}