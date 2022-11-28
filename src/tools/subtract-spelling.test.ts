import { Spelling } from "../types"
import { subtractSpelling } from "./subtract-spelling"

describe("tools/subtract-spelling.ts", () => {
    const cases: Array<[a: Spelling, b: Spelling, expected: Spelling]> = [
        [
            [
                { letter: "a", count: 3 },
                { letter: "c", count: 1 },
                { letter: "r", count: 2 },
            ],
            [
                { letter: "a", count: 1 },
                { letter: "b", count: 1 },
                { letter: "c", count: 1 },
            ],
            [
                { letter: "a", count: 2 },
                { letter: "r", count: 2 },
            ],
        ],
    ]
    for (const [a, b, expected] of cases) {
        it("should subtract spellings", () => {
            const got = subtractSpelling(a, b)
            expect(got).toEqual(expected)
        })
    }
})
