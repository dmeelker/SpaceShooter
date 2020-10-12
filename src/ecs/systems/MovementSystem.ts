import { EntityComponentSystem } from "../EntityComponentSystem";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { FrameTime } from "../../utilities/FrameTime";

export function update(time: FrameTime, ecs: EntityComponentSystem) {
    for(let velocityComponent of ecs.components.velocityComponents.all) {
        const dimensions = ecs.components.dimensionsComponents.get(velocityComponent.entityId);

        updateComponent(time, velocityComponent, dimensions);
    }
}

function updateComponent(time: FrameTime, velocityComponent: VelocityComponent, dimensionsComponent: DimensionsComponent) {
    dimensionsComponent.bounds.location.x += time.calculateMovement(velocityComponent.vector.x);
    dimensionsComponent.bounds.location.y += time.calculateMovement(velocityComponent.vector.y);
}