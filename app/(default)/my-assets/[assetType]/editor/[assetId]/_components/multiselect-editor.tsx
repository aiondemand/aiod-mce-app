'use client'

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CommandList } from "cmdk"


interface MultiSelectProps {
  value?: string[]
  onChange?: (newValue: string[]) => void

  items: string[];

}

const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  const [open, setOpen] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState<typeof props.items>(props.value || [])

  const handleSelect = React.useCallback((item: string) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i === item)
      if (isSelected) {
        return prev.filter((i) => i !== item)
      } else {
        return [...prev, item]
      }
    })
  }, [])

  const handleRemove = React.useCallback((item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item))
  }, [])

  React.useEffect(() => {
    props.onChange?.(selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems])

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedItems.length > 0
              ? `${selectedItems.length} selected`
              : "Select items..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0"
          side="top"
          align="start"
        >
          <Command className="">
            <CommandInput placeholder="Search items..." />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {props.items.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => handleSelect(item)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedItems.some((i) => i === item)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-1">
        {selectedItems.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="px-3 py-1 text-xs"
          >
            {item}
            <Button
              size='icon'
              type="button"
              className="p-1 w-fit h-fit ml-1"
              variant={'ghost'}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => handleRemove(item)}
              asChild
            >
              <span className="" >
                <X className="size-3" />
              </span>
            </Button>
          </Badge>
        ))}
      </div>
    </div >
  )
}


export default MultiSelect;
