import { Rectangle } from "../../utilities/Trig";
import { Component, EntityId } from "../EntityComponentSystem";

export class DimensionsComponent extends Component {
    public bounds: Rectangle;

    constructor(entityId: EntityId, bounds: Rectangle) {
        super(entityId);
        this.bounds = bounds;
    }
}
