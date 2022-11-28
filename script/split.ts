import FS from "fs"

console.log("Loading file...")
console.log()
const data = FS.readFileSync("./words.txt")
const lines = data.toString().split(/\r?\n/)
const communs = new Set<string>()
for (const line of lines) {
    const items = line.split(";")
    while (true) {
        const word = items.shift()
        if (typeof word !== "string") break

        if (word && word.length > 0) {
            communs.add(word)
            console.log(word)
            break
        }
    }
}
console.log()
console.log("Getting array...")
const communsArray = Array.from(communs)
console.log("Sorting array...")
communsArray.sort()
FS.writeFileSync("./communs.txt", communsArray.join("\n"))
console.log()
console.log("Communs:", communsArray.length)
