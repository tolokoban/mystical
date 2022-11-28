import { isObject } from "../../tools/guards"
import { loadText } from "../../tools/load-text"
import { repeat } from "../../tools/repeat"
import { spell } from "../../tools/spell"
import { subtractSpelling } from "../../tools/subtract-spelling"
import WordsTree from "./words-tree"

const Global: {
    busy: boolean
    tree: WordsTree | null
    nextSearch: string | null
} = {
    busy: true,
    tree: null,
    nextSearch: null,
}

self.onmessage = (evt: MessageEvent) => {
    const { data } = evt
    if (!isObject(data)) return

    if (data.type === "init") return void init()
    if (data.type === "find") return void find(data.input)
    console.log("🚀 [worker] data = ", data) // @FIXME: Remove this line written on 2022-11-28 at 11:17
}

function post(type: string, params: Record<string, unknown> = {}) {
    self.postMessage({
        ...params,
        type,
    })
}

async function init() {
    const communsText = await loadText("communs.txt")
    const words = communsText.split("\n")
    const propresText = await loadText("propres.txt")
    propresText.split("\n").forEach((word) => words.push(word))
    Global.tree = new WordsTree(words)
    Global.busy = false
    post("ready")
    if (Global.nextSearch) {
        void find(Global.nextSearch)
        Global.nextSearch = null
    }
}

function find(input: unknown) {
    if (typeof input !== "string") return
    if (!input) return

    Global.nextSearch = input
    const { tree } = Global
    if (!tree) return

    const words = tree.find(input)
    words.sort()
    post("anagrams", {
        input,
        words,
    })
}

function findAll(input: unknown) {
    if (typeof input !== "string") return
    if (!input) return

    const { tree } = Global
    if (!tree) return

    if (Global.busy) {
        Global.nextSearch = input
        return
    }

    Global.busy = true
    Global.nextSearch = null
    const output = new Set<string>()
    const fringe: Array<[input: string, words: string[]]> = [[input, []]]
    while (fringe.length > 0) {
        const current = fringe.shift()
        if (!current) break

        const [currentInput, currentWords] = current
        const currentSpelling = spell(currentInput)
        const words = tree.find(currentInput)
        for (const word of words) {
            const deltaSpelling = subtractSpelling(currentSpelling, spell(word))
            if (deltaSpelling.length > 0) {
                const newInput = deltaSpelling
                    .map(({ letter, count }) => repeat(letter, count))
                    .join("")
                fringe.push([newInput, [...currentWords, word]])
            } else {
                const newWords = [...currentWords, word]
                const newOutput = newWords.join(" ").trim()
                output.add(newOutput)
                post("anagrams", {
                    input,
                    words: Array.from(output),
                })
            }
        }
    }
    const finalWords = Array.from(output)
    finalWords.sort((a, b) => {
        let A = 0
        for (const charA of a) {
            if (charA <= " ") A++
        }
        let B = 0
        for (const charB of b) {
            if (charB <= " ") B++
        }
        const c = b.length - B - (a.length - A)
        if (c !== 0) return c
        return A - B
    })
    post("anagrams", {
        input,
        words: finalWords,
    })
    Global.busy = false
    return
}
