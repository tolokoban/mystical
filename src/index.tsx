import React from "react"
import { createRoot } from "react-dom/client"
import App from "./app"

function start() {
    const container = document.getElementById("root")
    const root = createRoot(container!) // createRoot(container!) if you use TypeScript
    root.render(<App />)

    const splash = document.getElementById("splash-screen")
    if (splash) splash.parentNode?.removeChild(splash)
}

start()
