import { DimensionsComponent } from "./components/DimensionsComponent";
import { RenderComponent } from "./components/RenderComponent";

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
}

export class EntityComponentSystem {
    public readonly components = new ComponentStore();
    public readonly entities = new Set<EntityId>();
    private _lastEntityId: EntityId = 0;

    public allocateEntityId(): EntityId {
        this._lastEntityId++;
        this.entities.add(this._lastEntityId);
        return this._lastEntityId;
    }

    public freeEntityId(id: EntityId) {
        this.entities.delete(id);
    }
}