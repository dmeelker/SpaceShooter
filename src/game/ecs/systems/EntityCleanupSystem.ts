import { IGameContext } from "../../../GameContext";

export function update(context: IGameContext) {
    const viewSizeWithMargin = context.viewSize.addBorder(50);
    for (let dimensions of context.ecs.components.dimensionsComponents.all) {
        if (!dimensions.bounds.overlaps(viewSizeWithMargin)) {
            context.ecs.disposeEntity(dimensions.entityId);
        }
    }
}