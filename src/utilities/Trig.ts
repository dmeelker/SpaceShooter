export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export class Rectangle {
    public location: Point;
    public size: Size;

    constructor(location: Point, size: Size) {
        this.location = location;
        this.size = size;
    }

    public overlaps(other: Rectangle): boolean {
        if (other.location.x + other.size.width <= this.location.x) return false;
        if (other.location.x >= this.location.x + this.size.width) return false;
        if (other.location.y + other.size.height <= this.location.y) return false;
        if (other.location.y >= this.location.y + this.size.height) return false;

        return true;
    }

    containsPoint(p: Point) {
        return p.x >= this.location.x && p.x < this.location.x + this.size.width &&
            p.y >= this.location.y && p.y < this.location.y + this.size.height;
    }
}

export class Vector {
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public add(vector: Vector) {
        return new Vector(this._x + vector.x, this._y + vector.y);
    }

    public subtract(vector: Vector) {
        return new Vector(this._x - vector.x, this._y - vector.y);
    }

    public multiplyScalar(scalar: number) {
        return new Vector(this._x * scalar, this._y * scalar);
    }

    public toUnit() {
        let length = this.length;

        return new Vector(this._x / length, this._y / length);
    }

    static interpolate(v1: Vector, v2: Vector, amount: number) {
        return new Vector(
            v1.x + ((v2.x - v1.x) * amount),
            v1.y + ((v2.y - v1.y) * amount));
    }

    public clone() {
        return new Vector(this.x, this.y);
    }

    static get zero() {
        return new Vector(0, 0);
    }
}