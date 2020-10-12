import { ImageLoader } from "../utilities/ImageLoader";
import { Point, Rectangle, Vector } from "../utilities/Trig";
import { DimensionsComponent } from "./components/DimensionsComponent";
import { RenderComponent } from "./components/RenderComponent";
import { VelocityComponent } from "./components/VelocityComponent";
import { EntityComponentSystem } from "./EntityComponentSystem";

export function createProjectile(ecs: EntityComponentSystem, images: ImageLoader, location: Point, vector: Vector) {
    const image = images.get("shot");
    const projectileId = ecs.allocateEntityId();

    const dimensions = new DimensionsComponent(projectileId, new Rectangle({x: location.x, y: location.y}, {width: image.width, height: image.height}));
    dimensions.center = {x: image.width / 2, y: image.height / 2};
    dimensions.rotationInDegrees = vector.angleInDegrees;
    
    ecs.components.dimensionsComponents.add(dimensions);
    ecs.components.renderComponents.add(new RenderComponent(projectileId, image));
    ecs.components.velocityComponents.add(new VelocityComponent(projectileId, vector));
}