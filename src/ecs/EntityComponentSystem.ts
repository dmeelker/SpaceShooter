import { ComputerControlledShipComponent } from "./components/ComputerControlledShipComponent";
import { DimensionsComponent } from "./components/DimensionsComponent";
import { ProjectileComponent } from "./components/ProjectileComponent";
import { ProjectileTargetComponent } from "./components/ProjectileTargetComponent";
import { RenderComponent } from "./components/RenderComponent";
import { VelocityComponent } from "./components/VelocityComponent";

export type EntityId = number;

export abstract class Component {
    public readonly entityId: EntityId;

    constructor(entityId: EntityId) {
        this.entityId = entityId;
    }
}

export class ComponentList<TComponent extends Component> {
    private readonly _components = new Map<EntityId, TComponent>();

    public get all(): Iterable<TComponent> {
        return this._components.values();
    }

    public get(id: EntityId) : TComponent | undefined {
        return this._components.get(id);
    }

    public add(component: TComponent) {
        return this._components.set(component.entityId, component);
    }

    public remove(id: EntityId) {
        return this._components.delete(id);
    }
}

export class ComponentStore {
    public readonly renderComponents = new ComponentList<RenderComponent>();
    public readonly dimensionsComponents = new ComponentList<DimensionsComponent>();
    public readonly velocityComponents = new ComponentList<VelocityComponent>();
    public readonly projectileComponents = new ComponentList<ProjectileComponent>();
    public readonly projectileTargetComponents = new ComponentList<ProjectileTargetComponent>();
    public readonly computerControlledShipComponents = new ComponentList<ComputerControlledShipComponent>();
    
    private readonly _all = [this.renderComponents, this.dimensionsComponents, this.velocityComponents, this.projectileComponents, this.projectileTargetComponents, this.computerControlledShipComponents];

    public removeComponentsForEntity(entityId: EntityId) {
        for(let store of this._all) {
            store.remove(entityId);
        }
    }
}

export class EntityComponentSystem {
    public readonly components = new ComponentStore();
    public readonly entities = new Set<EntityId>();
    private _lastEntityId: EntityId = 0;
    private readonly _availableEntityIds = new Array<EntityId>();
    private readonly _disposableEntityIds = new Array<EntityId>();

    public allocateEntityId(): EntityId {
        if (this._availableEntityIds.length > 0) {
            return this._availableEntityIds.pop();
        } else {
            this._lastEntityId++;
            this.entities.add(this._lastEntityId);
            return this._lastEntityId;
        }
    }

    public freeEntityId(id: EntityId) {
        this.entities.delete(id);
        this._availableEntityIds.push(id);
    }

    public disposeEntity(id: EntityId) {
        this._disposableEntityIds.push(id);
    }

    public removeDisposedEntities() {
        while(this._disposableEntityIds.length > 0) {
            const id = this._disposableEntityIds.pop();
            this.freeEntityId(id);
            this.components.removeComponentsForEntity(id);
        }
    }
}