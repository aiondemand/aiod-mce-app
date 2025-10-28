"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface HasPartEditorProps {
    value?: string[]
    onChange?: (ids: string[]) => void
}

const ID_REGEX = /^[a-z_]+_[A-Za-z0-9-]+$/

function extractId(input: string): string {
    if (/^https?:\/\//i.test(input)) {
        try {
            const url = new URL(input)
            const segments = url.pathname.split('/').filter(Boolean)
            const lastSegment = segments.pop() || ''
            return lastSegment.trim()
        } catch {
            return input.trim()
        }
    }
    return input.trim()
}

function validateId(id: string): boolean {
    return ID_REGEX.test(id)
}

export const HasPartEditor: React.FC<HasPartEditorProps> = ({ value = [], onChange }) => {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const [extractedId, setExtractedId] = React.useState("")
    const [isValid, setIsValid] = React.useState(true)

    React.useEffect(() => {
        const id = extractId(inputValue)
        setExtractedId(id)
        if (id) {
            setIsValid(validateId(id))
        } else {
            setIsValid(true) // empty is valid (no error shown)
        }
    }, [inputValue])

    const handleAdd = React.useCallback(() => {
        const id = extractedId
        if (!id || !isValid) return

        // Check for duplicates
        if (value.includes(id)) {
            setInputValue("")
            setOpen(false)
            return
        }

        onChange?.([...value, id])
        setInputValue("")
        setOpen(false)
    }, [extractedId, isValid, value, onChange])

    const handleRemove = React.useCallback((id: string) => {
        onChange?.(value.filter((i) => i !== id))
    }, [value, onChange])

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (extractedId && isValid) {
                handleAdd()
            }
        }
    }, [extractedId, isValid, handleAdd])

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-start"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add asset ID
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-90 max-w-full" align="start">
                    <div className="space-y-2">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium ">Asset ID or URL from MyLibrary</Label>
                            <Input
                                placeholder="e.g., evnt_abc123 or https://..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                        {inputValue && !isValid && (
                            <p className="text-xs text-destructive">
                                Invalid ID format. Expected pattern: type_IDstring
                            </p>
                        )}
                        {inputValue && extractedId !== inputValue && isValid && (
                            <p className="text-xs text-muted-foreground">
                                Extracted ID: {extractedId}
                            </p>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setInputValue("")
                                    setOpen(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleAdd}
                                disabled={!extractedId || !isValid}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {value.map((id) => (
                        <Badge
                            key={id}
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                        >
                            {id}
                            <Button
                                size="icon"
                                type="button"
                                className="p-1 w-fit h-fit ml-1"
                                variant="ghost"
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={() => handleRemove(id)}
                            >
                                <span>
                                    <X className="size-3" />
                                </span>
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HasPartEditor

