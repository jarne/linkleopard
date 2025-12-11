import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

export default function Button({
    children,
    color,
    className = "",
    ...props
}: ButtonProps) {
    let colorStyles = ""
    switch (color) {
        case "blue":
            colorStyles = "bg-blue-600 hover:bg-blue-700 text-white"
            break
        case "gray":
            colorStyles =
                "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
            break
        case "light-blue":
            colorStyles =
                "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
            break
        case "red":
            colorStyles =
                "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
            break
    }

    return (
        <button
            className={`flex-1 px-4 py-2 ${colorStyles} disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
