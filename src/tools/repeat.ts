export function repeat(text: string, occurences: number): string {
    let out = ""
    for (let i = 0; i < occurences; i++) {
        out = `${out}${text}`
    }
    return out
}
