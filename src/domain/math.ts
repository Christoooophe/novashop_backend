export function add(x: number, y: number) {
    if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('not a number');
    }

    return x + y;
}
