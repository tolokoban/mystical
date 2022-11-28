import { AnagramSolution } from "./../types"
import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const anagramInputAtom = atomWithStorage("anagram/input", "Fabien PETITJEAN")
const anagramWordsAtom = atomWithStorage<string[]>("anagram/words", [])

export function useAnagramInput() {
    return useAtom(anagramInputAtom)
}

export function useAnagramWords() {
    return useAtom(anagramWordsAtom)
}
