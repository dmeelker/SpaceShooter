import { Images } from "../utilities/Images";
import { Point, Rectangle, Vector } from "../utilities/Trig";
import { DimensionsComponent } from "./components/DimensionsComponent";
import { ProjectileComponent, ProjectileType } from "./components/ProjectileComponent";
import { ProjectileTargetComponent } from "./components/ProjectileTargetComponent";
import { RenderComponent } from "./components/RenderComponent";
import { VelocityComponent } from "./components/VelocityComponent";
import { EntityComponentSystem, EntityId } from "./EntityComponentSystem";

export function createProjectile(ecs: EntityComponentSystem, images: Images, location: Point, vector: Vector, type: ProjectileType): EntityId {
    const image = images.get("shot");
    const entityId = ecs.allocateEntityId();

    const dimensions = new DimensionsComponent(entityId, new Rectangle(location.x, location.y, image.width, image.height));
    dimensions.center = {x: image.width / 2, y: image.height / 2};
    dimensions.rotationInDegrees = vector.angleInDegrees;
    
    ecs.components.dimensionsComponents.add(dimensions);
    ecs.components.renderComponents.add(new RenderComponent(entityId, image));
    ecs.components.velocityComponents.add(new VelocityComponent(entityId, vector));
    ecs.components.projectileComponents.add(new ProjectileComponent(entityId, 1, type));

    return entityId;
}

export function createShip(ecs: EntityComponentSystem, images: Images, location: Point, vector: Vector): EntityId {
    const image = images.get("ship");
    const entityId = ecs.allocateEntityId();

    const dimensions = new DimensionsComponent(entityId, new Rectangle(location.x, location.y, image.width, image.height));
    dimensions.center = {x: image.width / 2, y: image.height / 2};
    dimensions.rotationInDegrees = vector.angleInDegrees;
    
    ecs.components.dimensionsComponents.add(dimensions);
    ecs.components.renderComponents.add(new RenderComponent(entityId, image));
    ecs.components.projectileTargetComponents.add(new ProjectileTargetComponent(entityId, 10, ProjectileType.enemy));
    ecs.components.velocityComponents.add(new VelocityComponent(entityId, vector));

    return entityId;
}