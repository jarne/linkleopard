import type { InputHTMLAttributes, PropsWithChildren } from "react"

type CheckboxInputProps = PropsWithChildren<
    InputHTMLAttributes<HTMLInputElement>
>

export default function Checkbox({
    className = "",
    ...props
}: CheckboxInputProps) {
    return (
        <input
            type="checkbox"
            className={`h-4 w-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            {...props}
        />
    )
}
