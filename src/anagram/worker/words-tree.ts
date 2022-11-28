import { AnagramSolution, Spelling } from "./../../types"
import { spell } from "../../tools/spell"

interface TreeNode {
    words: string[]
    children: TreeNode[]
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz"

export default class WordsTree {
    private readonly root: TreeNode = {
        words: [],
        children: [],
    }

    constructor(words: string[]) {
        for (const word of words) {
            this.addWord(word)
        }
    }

    find(input: string): string[] {
        const spelling = spell(input)
        const words: string[] = []
        search(words, 0, this.root, spelling)
        return words
    }

    private addWord(word: string) {
        const spelling = spell(word)
        if (spelling.length < 1) return

        let cursor = 0
        let { letter, count } = spelling[cursor]
        let node = this.root
        for (const letterInTree of LETTERS) {
            if (letter === letterInTree) {
                node = getLeaf(node, count)
                cursor++
                if (cursor >= spelling.length) {
                    node.words.push(word)
                    return
                }

                letter = spelling[cursor].letter
                count = spelling[cursor].count
            } else {
                node = getLeaf(node, 0)
            }
        }
    }

    toString() {
        return stringify(this.root.children).join("\n")
    }
}

function getLeaf(node: TreeNode, count: number): TreeNode {
    const leaf = node.children[count]
    if (leaf) return leaf

    const newLeaf = {
        words: [],
        children: [],
    }
    node.children[count] = newLeaf
    return newLeaf
}

function stringify(nodes: TreeNode[], letterIndex = 0, indent = ""): string[] {
    const result: string[] = []
    nodes.forEach((node, index) => {
        result.push(
            `${indent}${LETTERS[letterIndex]}-${index}: ${node.words.join(
                ", "
            )}`
        )
        const children = stringify(
            node.children,
            letterIndex + 1,
            `${indent}| `
        )
        for (const child of children) {
            result.push(child)
        }
    })
    return result
}

function search(
    solutions: string[],
    letterIndex: number,
    node: TreeNode,
    spelling: Spelling
) {
    if (letterIndex >= LETTERS.length) return
    if (spelling.length === 0) {
        for (const word of node.words) {
            solutions.push(word)
        }
        return
    }

    const [item] = spelling
    if (!item) return

    const letter = LETTERS[letterIndex]
    if (letter === item.letter) {
        spelling.shift()
        for (let i = item.count; i >= 0; i--) {
            const child = node.children[i]
            if (child) {
                search(solutions, letterIndex + 1, child, spelling)
            }
        }
        spelling.unshift(item)
    } else {
        const child = node.children[0]
        if (child) {
            search(solutions, letterIndex + 1, child, spelling)
        }
    }
}
