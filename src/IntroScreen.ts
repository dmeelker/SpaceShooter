import { IGameContext } from "./GameContext";
import { FrameTime } from "./utilities/FrameTime";
import { IScreen } from "./utilities/ScreenManager";
import { Point, Rectangle } from "./utilities/Trig";
import { DomUiEventProvider, Ui } from "./utilities/Ui";

export class IntroScreen implements IScreen {
    private readonly _gameContext: IGameContext;
    private readonly _ui = new Ui();
    private readonly _uiInputProvider;

    public constructor(gameContext: IGameContext) {
        this._gameContext = gameContext;
        this._uiInputProvider = new DomUiEventProvider(this._ui, gameContext.canvas);

        this._ui.defaultFont = gameContext.smallFont;
    }

    onActivate(): void {
        this._uiInputProvider.hook();
    }

    onDeactivate(): void {
        this._uiInputProvider.unhook();
    }

    update(time: FrameTime): void {
        
    }

    render(renderContext: CanvasRenderingContext2D): void {
        this._gameContext.mediumFont.render(renderContext, new Point(100, 100), "INTRO!");

        if(this._ui.textButton(renderContext, new Rectangle(10, 10, 200, 40), "Play!")) {
            this._gameContext.screenManager.activateScreen(this._gameContext.playScreen);
        }

        this._ui.frameDone();   
    }
}