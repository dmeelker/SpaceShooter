import { IGameContext } from "../../GameContext";
import { FrameTime } from "../../utilities/FrameTime";
import { Vector } from "../../utilities/Trig";
import { ComputerControlledShipComponent, MovementMode } from "../components/ComputerControlledShipComponent";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { ProjectileType } from "../components/ProjectileComponent";
import { createProjectile } from "../EntityFactory";

export function update(context: IGameContext) {
    for (let ship of context.ecs.components.computerControlledShipComponents.all) {
        const dimensions = context.ecs.components.dimensionsComponents.get(ship.entityId);

        moveShip(ship, dimensions, context.time);
        updateFire(ship, context, dimensions);
    }
}

function updateFire(ship: ComputerControlledShipComponent, context: IGameContext, dimensions: DimensionsComponent) {
    if (ship.fireTimer.update(context.time.currentTime)) {
        const tankBounds = dimensions.bounds;

        createProjectile(context.ecs, context.images, tankBounds.location, Vector.fromDegreeAngle(dimensions.rotationInDegrees).multiplyScalar(200), ProjectileType.enemy);
    }
}

function moveShip(ship: ComputerControlledShipComponent, dimensions: DimensionsComponent, time: FrameTime) {
    if(ship.movementMode == MovementMode.straightLine) {
        dimensions.bounds.location.x += time.calculateMovement(ship.vector.x);
        dimensions.bounds.location.y += time.calculateMovement(ship.vector.y);
        dimensions.rotationInDegrees = ship.vector.angleInDegrees;
    }
}