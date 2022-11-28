import * as React from "react"

import "./chip-view.css"

export interface ChipViewProps {
    className?: string
    onClick?(): void
    children: React.ReactNode
}

export default function ChipView({ children, onClick }: ChipViewProps) {
    const handleClick = () => {
        if (onClick) onClick()
    }
    return (
        <div className="view-ChipView" tabIndex={0} onClick={handleClick}>
            {children}
        </div>
    )
}
