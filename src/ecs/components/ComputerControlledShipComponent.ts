import { Timer } from "../../utilities/Timer";
import { Vector } from "../../utilities/Trig";
import { Component, EntityId } from "../EntityComponentSystem";

export enum MovementMode {
    straightLine
}

export class ComputerControlledShipComponent extends Component {
    public readonly movementMode: MovementMode
    public vector: Vector = Vector.zero;
    public fireTimer = new Timer(2000);

    constructor(entityId: EntityId, movementMode: MovementMode) {
        super(entityId);
        this.movementMode = movementMode;
    }
}