export function isObject(data: unknown): data is Record<string, unknown> {
    if (!data) return false
    if (Array.isArray(data)) return false
    return typeof data === "object"
}

export function isString(data: unknown): data is string {
    return typeof data === "string"
}

export function assertStringArray(data: unknown): asserts data is string[] {
    assertArray(data)
    for (const item of data) {
        assertString(item)
    }
}

export function assertArray(data: unknown): asserts data is unknown[] {
    if (!Array.isArray(data))
        throw Error(`Expected an array but got a "${typeof data}"!`)
}

export function assertString(data: unknown): asserts data is string {
    if (!isString(data))
        throw Error(`Expected a string but got a "${typeof data}"!`)
}
