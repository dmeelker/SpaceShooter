import { DimensionsComponent } from "../components/DimensionsComponent";
import { FrameTime } from "../../../utilities/FrameTime";
import { IGameContext } from "../../../GameContext";
import { Point, Vector } from "../../../utilities/Trig";

export function update(game: IGameContext) {
    for(let targetComponent of game.ecs.components.seekingTargetComponents.all) {
        const dimensions = game.ecs.components.dimensionsComponents.get(targetComponent.entityId);
        const targetDimensions = game.ecs.components.dimensionsComponents.get(targetComponent.targetId);

        moveTowardsTarget(dimensions, targetDimensions.bounds.location, game.time);
    }
}

function moveTowardsTarget(dimensions: DimensionsComponent, target: Point, time: FrameTime) {
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

    let vector = Vector.fromDegreeAngle(newRotation).multiplyScalar(200);
    
    dimensions.bounds.location.x += time.calculateMovement(vector.x);
    dimensions.bounds.location.y += time.calculateMovement(vector.y);
    dimensions.rotationInDegrees = vector.angleInDegrees;
}