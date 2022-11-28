import { Spelling } from "../types"

export function subtractSpelling(a: Spelling, b: Spelling): Spelling {
    const c: Spelling = []
    for (const { letter: letterA, count: countA } of a) {
        const item = b.find(({ letter: letterB }) => letterA === letterB)
        if (!item) {
            c.push({ letter: letterA, count: countA })
        } else {
            const countC = Math.max(0, countA - item.count)
            if (countC > 0) {
                c.push({ letter: letterA, count: countC })
            }
        }
    }
    return c
}
