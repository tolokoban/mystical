import * as React from "react"
import Anagram from "../anagram"

import "./app.css"
import { useAnagramInput, useAnagramWords } from "../state/anagram"
import { spell } from "../tools/spell"
import { subtractSpelling } from "../tools/subtract-spelling"
import { spellingToString } from "../tools/spell-to-string"
import ChipView from "../view/chip/chip-view"
export interface AppProps {
    className?: string
}

const Service = new Anagram()

export default function App(props: AppProps) {
    const [text, setText] = useAnagramInput()
    const [words, setWords] = useAnagramWords()
    const [solutions, setSolutions] = React.useState<string[]>([])
    const rest = computeRest(text, words)
    React.useEffect(() => {
        Service.eventSolution.addListener(setSolutions)
        return () => Service.eventSolution.removeListener(setSolutions)
    }, [])
    const handleSelectWord = (word: string) => {
        setWords([...words, word])
    }
    const handleFind = () => {
        setSolutions([])
        Service.find(rest)
    }
    const handleRemoveWords = (index) => {
        setWords(words.filter((_word, idx) => idx !== index))
    }
    React.useEffect(handleFind, [words])
    return (
        <div className={getClassNames(props)}>
            <textarea
                value={text}
                cols={40}
                rows={4}
                onChange={(evt) => setText(evt.target.value)}
            ></textarea>
            <br />
            <button onClick={handleFind}>Find Anagrams</button>
            <br />
            {words.map((word, index) => (
                <ChipView key={word} onClick={() => handleRemoveWords(index)}>
                    {word}
                </ChipView>
            ))}
            <span>{rest.toUpperCase()}</span>
            <ul>
                {solutions.map((word) => (
                    <li key={word} onClick={() => handleSelectWord(word)}>
                        {word}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function getClassNames(props: AppProps): string {
    const classNames = ["custom", "-App"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function computeRest(text: string, words: string[]) {
    let spelling = spell(text)
    for (const word of words) {
        spelling = subtractSpelling(spelling, spell(word))
    }
    return spellingToString(spelling)
}
