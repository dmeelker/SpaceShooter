export function randomInt(min: number, max: number): number {
    return Math.floor(min + (Math.random() * (max - min)));
}

export function randomArrayIndex<T>(array: Array<T>): number {
    return randomInt(0, array.length);
}

export function chance(value: number) : boolean {
    return randomInt(0, 100) <= value;
}