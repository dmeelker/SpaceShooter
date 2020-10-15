import { EntityComponentSystem } from "../EntityComponentSystem";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { FrameTime } from "../../utilities/FrameTime";
import { IGameContext } from "../../GameContext";

export function update(context: IGameContext) {
    for(let velocityComponent of context.ecs.components.velocityComponents.all) {
        const dimensions = context.ecs.components.dimensionsComponents.get(velocityComponent.entityId);

        updateComponent(context.time, velocityComponent, dimensions);
    }
}

function updateComponent(time: FrameTime, velocityComponent: VelocityComponent, dimensionsComponent: DimensionsComponent) {
    dimensionsComponent.bounds.location.x += time.calculateMovement(velocityComponent.vector.x);
    dimensionsComponent.bounds.location.y += time.calculateMovement(velocityComponent.vector.y);
}