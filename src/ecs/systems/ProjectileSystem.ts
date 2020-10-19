import { IGameContext } from "../../GameContext";
import { Rectangle } from "../../utilities/Trig";
import { ProjectileComponent } from "../components/ProjectileComponent";
import { createExplosion } from "../EntityFactory";

export function update(context: IGameContext) {
    const projectiles = context.ecs.components.projectileComponents.all;

    for (let projectile of projectiles) {
        const projectileDimensions = context.ecs.components.dimensionsComponents.get(projectile.entityId).bounds;
        handleTargetCollisions(context, projectileDimensions, projectile);
    }
}

function handleTargetCollisions(context: IGameContext, projectileDimensions: Rectangle, projectile: ProjectileComponent) {
    for (let target of context.ecs.components.projectileTargetComponents.all) {
        const targetDimensions = context.ecs.components.dimensionsComponents.get(target.entityId).bounds;

        if (projectile.source != target.type && projectileDimensions.overlaps(targetDimensions)) {
            target.hitpoints -= projectile.power;
            target.lastHitTime = context.time.currentTime;

            if (target.hitpoints <= 0) {
                createExplosion(context, targetDimensions.location);
                context.ecs.disposeEntity(target.entityId);
            }

            context.ecs.disposeEntity(projectile.entityId);
        }
    }
}
