import type { InputHTMLAttributes, PropsWithChildren } from "react"

type TextInputProps = PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>

export default function TextInput({
    className = "",
    ...props
}: TextInputProps) {
    return (
        <input
            className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            {...props}
        />
    )
}
