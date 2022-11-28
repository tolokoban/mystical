const PEOPLE: { [name: string]: string[] } = {
    Jeannot: ["Jeannot", "Marie-Louise"],
    "Marie-Louise": ["Jeannot", "Marie-Louise"],
    //---------------------------------------------------
    Bernard: ["Bernard", "Muriel", "Rémi", "Pauline"],
    Muriel: ["Bernard", "Muriel", "Rémi", "Pauline"],
    Rémi: ["Bernard", "Muriel", "Rémi", "Pauline"],
    //---------------------------------------------------
    Karine: ["Karine", "Fabien", "Automne", "Agathe", "Hortense"],
    Fabien: ["Karine", "Fabien", "Automne", "Agathe", "Hortense"],
    Automne: ["Karine", "Fabien", "Automne", "Agathe", "Hortense"],
    Agathe: ["Karine", "Fabien", "Automne", "Agathe", "Hortense"],
    Hortense: ["Karine", "Fabien", "Automne", "Agathe", "Hortense"],
    //---------------------------------------------------
    Mathieu: ["Mathieu", "Pauline"],
    Pauline: ["Bernard", "Muriel", "Rémi", "Mathieu", "Pauline"],
}

const names = Array.from(Object.keys(PEOPLE))
let loses = -1
while (true) {
    loses++
    const indexes: number[] = []
    for (let i = 0; i < names.length; i++) {
        indexes.push(i)
    }
    for (let i = 0; i < names.length; i++) {
        const k = Math.floor(Math.random() * names.length)
        const tmp = indexes[i]
        indexes[i] = indexes[k]
        indexes[k] = tmp
    }
    let failure = false
    const mapping: { [name: string]: string } = {}
    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        const target = names[indexes[i]]
        mapping[name] = target
        if (PEOPLE[name].includes(target)) {
            failure = true
            break
        }
    }
    if (failure) continue

    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        const target = mapping[name]
        if (mapping[target] === name) {
            failure = true
            break
        }
    }
    console.log("Rejected:", loses)
    if (failure) continue

    console.log()
    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        const target = names[indexes[i]]
        console.log(pad(name), "->", target)
    }
    break
}

function pad(txt: string): string {
    while (txt.length < 20) txt = `${txt} `
    return txt
}
