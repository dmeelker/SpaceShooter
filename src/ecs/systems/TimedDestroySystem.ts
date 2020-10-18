import { EntityComponentSystem } from "../EntityComponentSystem";
import { IGameContext } from "../../GameContext";

export function update(game: IGameContext) {
    for(let component of game.ecs.components.timedDestroyComponents.all) {
        if(component.destroyTime <= game.time.currentTime) {
            game.ecs.disposeEntity(component.entityId);
        }
    }
}