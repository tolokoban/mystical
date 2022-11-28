import { Spelling } from "../types"

export function spell(word: string): Spelling {
    const counters = new Map<string, number>()
    for (const c of word) {
        const letters = getLetters(c)
        if (!letters) continue

        for (const letter of letters) {
            const count = counters.get(letter)
            if (!count) {
                counters.set(letter, 1)
            } else {
                counters.set(letter, count + 1)
            }
        }
    }
    const spelling: Spelling = []
    for (const letter of counters.keys()) {
        const count = counters.get(letter)
        if (count) spelling.push({ letter, count })
    }
    spelling.sort((a, b) => {
        const A = a.letter
        const B = b.letter
        if (A < B) return -1
        if (A > B) return +1
        return 0
    })
    return spelling
}

function getLetters(c: string): string | null {
    c = c.toLowerCase()
    if ("àáäâ".includes(c)) return "a"
    if ("èéëê".includes(c)) return "e"
    if ("ìíïî".includes(c)) return "i"
    if ("òóöô".includes(c)) return "o"
    if ("ùúüû".includes(c)) return "u"
    if (c === "ç") return "c"
    if (c === "ñ") return "n"
    if (c === "ß") return "ss"
    if (c === "æ") return "ae"
    if (c === "œ") return "oe"
    if (c >= "a" && c <= "z") return c
    return null
}
