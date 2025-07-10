import { Plus, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface KeywordEditorProps {
    keywords: string[];
    onChange: (keywords: string[]) => void;
}

const KeywordEditor: React.FC<KeywordEditorProps> = ({
    keywords,
    onChange
}) => {
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")


    const addKeyword = () => {
        const trimmedValue = inputValue.trim()

        if (!trimmedValue) return

        if (trimmedValue.startsWith("#")) {
            setError("Keywords cannot start with #")
            return
        }

        if (keywords.includes(trimmedValue)) {
            setError("Keyword already exists")
            return
        }

        onChange([...keywords, trimmedValue])
        setInputValue("")
        setError("")
    }

    const removeKeyword = (keywordToRemove: string) => {
        onChange(keywords.filter((keyword) => keyword !== keywordToRemove))
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addKeyword()
        }
    }

    const handleInputChange = (value: string) => {
        setInputValue(value)
        if (error) setError("")
    }


    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Enter a keyword..."
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <Button onClick={addKeyword} size="icon" variant="outline" type="button">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2">
                {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                <span>{keyword}</span>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    size="icon"
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                    onClick={() => removeKeyword(keyword)}
                                >
                                    <X className="w-3 h-3" />
                                    <span className="sr-only">Remove {keyword}</span>
                                </Button>
                            </Badge>
                        ))}
                    </div>

                )}
                {keywords.length === 0 && (
                    <div className="text-muted-foreground flex items-center min-h-[26px] w-full">
                        <p className="text-xs px-3 py-1 bg-muted border border-dashed border-border rounded-md">No entries added yet</p>
                    </div>
                )}
            </div>


        </div>
    )
};

export default KeywordEditor;