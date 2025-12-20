import { Link } from "@/app/lib/link"
import Button from "@/app/lib/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"

/**
 * Sortable link item component, contains link details
 * and edit/delete buttons
 */
export default function SortableLinkItem({
    link,
    onEdit,
    onDelete,
}: {
    link: Link
    onEdit: (link: Link) => void
    onDelete: (id: number) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                        {...attributes}
                        {...listeners}
                        className="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Drag to reorder"
                        title="Drag to reorder"
                    >
                        ≡
                    </button>
                    {link.icon && (
                        <div className="text-3xl flex h-12 w-12 items-center justify-center overflow-hidden">
                            <Image
                                src={link.icon}
                                width={48}
                                height={48}
                                alt={link.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {link.name}
                        </h3>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
                        >
                            {link.url}
                        </a>
                    </div>
                </div>
                <div className="flex gap-2 ml-4">
                    <Button color="light-blue" onClick={() => onEdit(link)}>
                        Edit
                    </Button>
                    <Button color="red" onClick={() => onDelete(link.id)}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}
