export class Keyboard {
    private readonly _keyStates = new Map<string, boolean>();
    private readonly _frameButtonPresses = new Map<string, boolean>();

    constructor() {
        this.hook();
    }

    private hook() {
        document.addEventListener('keydown', event => this.onKeyDown(event));
        document.addEventListener('keyup', event => this.onKeyUp(event));
    }

    private onKeyDown(keyEvent: KeyboardEvent) {
        this._keyStates.set(keyEvent.key, true);
        this._frameButtonPresses.set(keyEvent.key, true);
    }

    private onKeyUp(keyEvent: KeyboardEvent) {
        this._keyStates.set(keyEvent.key, false);
    }

    public isButtonDown(key: string): boolean {
        if(this._keyStates.has(key)) {
            return this._keyStates.get(key);
        }

        return false;
    }

    public wasButtonPressedInFrame(key: string): boolean {
        if(this._frameButtonPresses.has(key)) {
            return this._frameButtonPresses.get(key);
        }

        return false;
    }

    public nextFrame() {
        this._frameButtonPresses.clear();
    }
}