import { Component, EntityId } from "../EntityComponentSystem";

export class ComputerControlledShipComponent extends Component {
    constructor(entityId: EntityId) {
        super(entityId);
    }
}