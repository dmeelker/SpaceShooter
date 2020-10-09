import { Component, EntityId } from "../EntityComponentSystem";

export class RenderComponent extends Component {
    public image: CanvasImageSource;

    constructor(entityId: EntityId, image: CanvasImageSource) {
        super(entityId);
        this.image = image;
    }
}
