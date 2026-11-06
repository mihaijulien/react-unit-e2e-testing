import { describe, it } from "vitest";
import { range } from "./utils.js"

describe("Testing utilities and helpers", () => {
    describe("range", () => {
        it("returns correct result from 1-6", () => {
            const result = range(1, 6);
            expect(result).length(5);
        });
        it("returns correct result from 41-45 range", () => {
            const result = range(41, 45);
            expect(result).toEqual([41,42,43,44]);
        })
    });
});