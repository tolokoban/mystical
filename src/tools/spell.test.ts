import { Spelling } from "./../types"
import { spell } from "./spell"

describe("tools/spell.ts", () => {
    const cases: Array<[input: string, expected: Spelling]> = [
        [
            "good",
            [
                { letter: "d", count: 1 },
                { letter: "g", count: 1 },
                { letter: "o", count: 2 },
            ],
        ],
    ]
    for (const [input, expected] of cases) {
        it(`should spell "${input}"`, () => {
            const got = spell(input)
            expect(got).toEqual(expected)
        })
    }
})
