import { createJsxClosingElement } from "typescript";
import { Font } from "./Font";
import { Point, Rectangle } from "./Trig";

class MouseState {
    public x: number;
    public y: number;
    public buttonDown: boolean = false;

    public clone(): MouseState {
        var clone = new MouseState();
        clone.x = this.x;
        clone.y = this.y;
        clone.buttonDown = this.buttonDown;
        return clone;
    }
}

export class Ui {
    private _currentMouseState = new MouseState();
    private _previousMouseState = new MouseState();
    public defaultFont: Font;

    public mouseMove(x: number, y: number) {
        this._currentMouseState.x = x;
        this._currentMouseState.y = y;
    }

    public mouseDown() {
        this._currentMouseState.buttonDown = true;
    }

    public mouseUp() {
        this._currentMouseState.buttonDown = false;
    }

    public frameDone() {
        this._previousMouseState = this._currentMouseState;
        this._currentMouseState = this._previousMouseState.clone();
    }

    public textButton(context: CanvasRenderingContext2D, rectangle: Rectangle, text: string): boolean {
        context.beginPath();
        context.fillStyle = this.mouseHoverIn(rectangle) ? "green" : "red";
        context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

        if(this.defaultFont) {
            const center = rectangle.center;
            let stringSize = this.defaultFont.calculateSize(text);
            this.defaultFont.render(context, new Point(center.x - (stringSize.width / 2), center.y - (stringSize.height / 2)), text);
        }

        if(this.mouseClickedIn(rectangle)) {
            return true;
        }

        return false;
    }

    private mouseHoverIn(rectangle: Rectangle): boolean {
        return rectangle.containsPoint(new Point(this._currentMouseState.x, this._currentMouseState.y));
    }

    private mouseClickedIn(rectangle: Rectangle): boolean {
        return this.mouseHoverIn(rectangle) && this._previousMouseState.buttonDown && !this._currentMouseState.buttonDown;
    }
}
