export async function loadText(url: string): Promise<string> {
    const response = await fetch(`../data/${url}`)
    if (!response.ok) {
        console.error(response.status, "  ", response.statusText)
        return ""
    }
    return response.text()
}
