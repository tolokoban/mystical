export type Spelling = Array<{
    letter: string
    count: number
}>

export interface AnagramSolution {
    input: string
    /**
     * Percentage of letters used.
     * 1.0 if all the letters have been used.
     */
    score: number
    words: string[]
    remainingLetters: string[]
}
