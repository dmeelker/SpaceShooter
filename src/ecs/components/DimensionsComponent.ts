import { degreesToRadians, Point, Rectangle } from "../../utilities/Trig";
import { Component, EntityId } from "../EntityComponentSystem";

export class DimensionsComponent extends Component {
    public bounds: Rectangle;
    public scale: Point = {x: 1, y: 1};
    public center: Point = {x: 0, y: 0};
    private _rotationInDegrees: number = 0;
    private _rotationInRadians: number = 0;

    constructor(entityId: EntityId, bounds: Rectangle) {
        super(entityId);
        this.bounds = bounds;
    }

    public get rotationInDegrees(): number {
        return this._rotationInDegrees;
    }

    public get rotationInRadians(): number {
        return this._rotationInRadians;
    }

    public set rotationInDegrees(degrees: number) {
        this._rotationInDegrees = degrees;
        this._rotationInRadians = degreesToRadians(degrees);
    }
}
