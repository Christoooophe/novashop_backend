import {add} from "./math";

describe("add", () => {
    it("rejette une entrée non numérique", () => {
        expect(() => add('2' as any, 3)).toThrow(Error);
    });
    test.each([
        [2, 3, 5],
        [-2, -3, -5],
        [0, 0, 0],
    ])('add(%i, %i) = %i', (x, y, expected) => {
        expect(add(x, y)).toBe(expected);
    });

    it('rejette une entrée non numérique', () => {
        expect(() => add('2' as any, 3)).toThrow(Error);
    });
});

describe('add', () => {

});
