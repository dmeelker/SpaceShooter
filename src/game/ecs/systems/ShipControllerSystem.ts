import { IGameContext } from "../../../GameContext";
import { FrameTime } from "../../../utilities/FrameTime";
import { normalizeDegrees, Point, Vector } from "../../../utilities/Trig";
import { ComputerControlledShipComponent, MovementMode } from "../components/ComputerControlledShipComponent";
import { DimensionsComponent } from "../components/DimensionsComponent";
import { ProjectileType } from "../components/ProjectileComponent";
import { createProjectile } from "../EntityFactory";

export function update(context: IGameContext) {
    for (let ship of context.ecs.components.computerControlledShipComponents.all) {
        const dimensions = context.ecs.components.dimensionsComponents.get(ship.entityId);

        moveShip(ship, dimensions, context.time, context);
        updateFire(ship, context, dimensions);
    }
}

function updateFire(ship: ComputerControlledShipComponent, context: IGameContext, dimensions: DimensionsComponent) {
    if (ship.fireTimer.update(context.time.currentTime)) {
        const shipLocation = dimensions.centerLocation;
        const targetLocation = context.ecs.components.dimensionsComponents.get(context.playerId).centerLocation;
        const vectorToTarget = targetLocation.toVector().subtract(shipLocation.toVector());

        const shipHeading = normalizeDegrees(dimensions.rotationInDegrees);
        const headingToTarget = normalizeDegrees(vectorToTarget.angleInDegrees);

        if(Math.abs(shipHeading - headingToTarget) < 90) {
            createProjectile(context, shipLocation, vectorToTarget.toUnit().multiplyScalar(200), ProjectileType.enemy);
        }
    }
}

function moveShip(ship: ComputerControlledShipComponent, dimensions: DimensionsComponent, time: FrameTime, context: IGameContext) {
    if(ship.movementMode == MovementMode.straightLine) {
        dimensions.bounds.location.x += time.calculateMovement(ship.vector.x);
        dimensions.bounds.location.y += time.calculateMovement(ship.vector.y);
        dimensions.rotationInDegrees = ship.vector.angleInDegrees;
    } else if(ship.movementMode == MovementMode.path) {
        const target = levelToScreenCoordinates(ship.path[ship.currentPathTarget], context);

        if (dimensions.bounds.location.distanceTo(target) <= 20) {
            if(ship.currentPathTarget < ship.path.length - 1) {
                ship.currentPathTarget++;
            } else {
                ship.vector = Vector.fromDegreeAngle(dimensions.rotationInDegrees).multiplyScalar(50);
                ship.movementMode = MovementMode.straightLine;
            }
        } else {
            moveTowardsPoint(ship, dimensions, target, time);
        }
    }
}

function moveTowardsPoint(ship: ComputerControlledShipComponent, dimensions: DimensionsComponent, target: Point, time: FrameTime) {
    const targetVector = new Vector(target.x - dimensions.bounds.location.x, target.y - dimensions.bounds.location.y).toUnit();
    const targetRotation = targetVector.angleInDegrees;
    const currentRotation = dimensions.rotationInDegrees;
    const rotationDiff = Math.min(targetRotation - currentRotation, currentRotation - targetRotation);
    const rotationDirection = rotationDiff / Math.abs(rotationDiff);
    const rotationSpeed = 2;
    let newRotation = currentRotation;

    if(Math.abs(rotationDiff) > rotationSpeed) {
        newRotation = currentRotation + (rotationSpeed * rotationDirection);
    } else {
        newRotation = targetRotation;
    }

    let vector = Vector.fromDegreeAngle(newRotation).multiplyScalar(50);
    
    dimensions.bounds.location.x += time.calculateMovement(vector.x);
    dimensions.bounds.location.y += time.calculateMovement(vector.y);
    dimensions.rotationInDegrees = vector.angleInDegrees;
}

function levelToScreenCoordinates(levelCoordinates: Point, context: IGameContext): Point {
    return new Point(
        context.viewSize.size.width * (levelCoordinates.x / 100),
        context.viewSize.size.height * (levelCoordinates.y / 100))
}