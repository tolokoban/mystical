import GenericEvent from "../tools/generic-events"
import { assertStringArray, isObject, isString } from "../tools/guards"
import { AnagramSolution } from "../types"

export default class Anagram {
    public readonly eventReady = new GenericEvent<void>()
    public readonly eventSolution = new GenericEvent<string[]>()

    private readonly worker: Worker

    constructor() {
        this.worker = new Worker(new URL("./worker/worker.ts", import.meta.url))
        this.worker.onmessage = this.handleWorkerMessage
        this.post("init")
    }

    find(input: string) {
        console.log(">>> Find:", input)
        this.post("find", { input })
    }

    private post(type: string, params: Record<string, unknown> = {}) {
        this.worker.postMessage({
            ...params,
            type,
        })
    }

    private readonly handleWorkerMessage = (evt: MessageEvent) => {
        const { data } = evt
        if (!isObject(data)) return
        const { type } = data
        if (!isString(type)) return

        if (type === "ready") {
            this.eventReady.dispatch()
            console.log("Ready!")
            return
        }
        if (type === "anagrams") {
            try {
                const { input, words } = data
                console.log("<<< Find:", input, words)
                assertStringArray(words)
                this.eventSolution.dispatch(words)
                return
            } catch (ex) {
                console.error("Error with data:", data)
                throw ex
            }
        }
    }
}
