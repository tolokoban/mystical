import { Spelling } from "./../types"
import { repeat } from "./repeat"

export function spellingToString(spelling: Spelling): string {
    return spelling.map(({ letter, count }) => repeat(letter, count)).join("")
}
