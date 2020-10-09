import { ComponentStore, EntityComponentSystem } from "../EntityComponentSystem";
import { RenderComponent } from "../components/RenderComponent";
import { DimensionsComponent } from "../components/DimensionsComponent";

export function render(ecs: EntityComponentSystem, context: CanvasRenderingContext2D) {
    for(let renderComponent of ecs.components.renderComponents.all) {
        const dimensions = ecs.components.dimensionsComponents.get(renderComponent.entityId);
        updateComponent(renderComponent, dimensions, context);
    }
}

function updateComponent(renderComponent: RenderComponent, dimensionsComponent: DimensionsComponent, context: CanvasRenderingContext2D) {
    context.drawImage(renderComponent.image, dimensionsComponent.bounds.location.x, dimensionsComponent.bounds.location.y);
}