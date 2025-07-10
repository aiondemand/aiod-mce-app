import { TaxonomyEntry } from "@/lib/taxonomy-utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface TaxonomySelectorProps {
    values: string[];
    onChange: (values: string[]) => void;
    maxValues?: number;
    taxonomy: TaxonomyEntry[];
}

// Recursive component to render taxonomy menu items
const TaxonomyMenuItems: React.FC<{
    entries: TaxonomyEntry[];
    onSelect: (entry: TaxonomyEntry) => void;
    selectedValues: string[];
}> = ({ entries, onSelect, selectedValues }) => {
    return (
        <>
            {entries.map((entry, index) => {
                const entryString = entry.toString();
                const isSelected = selectedValues.includes(entryString);

                // If this entry has subterms, render as submenu
                if (entry.subterms.length > 0) {
                    return (
                        <DropdownMenuSub key={index}>
                            <DropdownMenuSubTrigger className={isSelected ? "opacity-50" : ""}>
                                {entry.term}
                                {isSelected && <span className="ml-1 text-xs">(selected)</span>}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                {/* Allow selecting the parent term itself */}
                                <DropdownMenuItem
                                    onClick={() => onSelect(entry)}
                                    disabled={isSelected}
                                    className={isSelected ? "opacity-50" : ""}
                                >
                                    Select &quot;{entry.term}&quot;
                                    {isSelected && <span className="ml-1 text-xs">(selected)</span>}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {/* Render subterms */}
                                <TaxonomyMenuItems
                                    entries={entry.subterms}
                                    onSelect={onSelect}
                                    selectedValues={selectedValues}
                                />
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    );
                }

                // Leaf node - render as regular menu item
                return (
                    <DropdownMenuItem
                        key={index}
                        onClick={() => onSelect(entry)}
                        disabled={isSelected}
                        className={isSelected ? "opacity-50" : ""}
                    >
                        {entry.term}
                        {isSelected && <span className="ml-1 text-xs">(selected)</span>}
                    </DropdownMenuItem>
                );
            })}
        </>
    );
};

const TaxonomySelector: React.FC<TaxonomySelectorProps> = ({
    values,
    taxonomy,
    maxValues,
    onChange
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const removeKeyword = (keywordToRemove: string) => {
        onChange(values.filter(value => value !== keywordToRemove));
    }

    const addKeyword = (keyword: string) => {
        onChange([...values, keyword]);
    }

    const handleTaxonomySelect = (entry: TaxonomyEntry) => {
        const entryString = entry.toString();
        if (!values.includes(entryString)) {
            addKeyword(entryString);
        }
        setIsOpen(false); // Close dropdown after selection
    }

    const showAddKeyword = maxValues ? values.length < maxValues : true;

    return <div className="space-y-3">
        {values.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {values.map((keyword, index) => (
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

        {showAddKeyword && taxonomy.length > 0 && (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Plus className="w-4 h-4" />
                        Add new entry
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-[400px] overflow-y-auto p-1" align="start">
                    <TaxonomyMenuItems
                        entries={taxonomy}
                        onSelect={handleTaxonomySelect}
                        selectedValues={values}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        )}
    </div>
};

export default TaxonomySelector;