import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface AutocompleteOption {
  /** Unique value for the option */
  value: string;
  /** Display label */
  label: string;
  /** Optional description shown below label */
  description?: string;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional group name for categorization */
  group?: string;
}

export interface AutocompleteProps {
  /** Available options */
  options: AutocompleteOption[];
  /** Currently selected value(s) */
  value?: string | string[];
  /** Callback when selection changes */
  onValueChange?: (value: string | string[]) => void;
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Text shown when no options match search */
  emptyText?: string;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Disable the component */
  disabled?: boolean;
  /** Custom filter function */
  filterFn?: (option: AutocompleteOption, search: string) => boolean;
  /** Callback when search changes (for async loading) */
  onSearchChange?: (search: string) => void;
  /** Minimum characters before searching */
  minSearchLength?: number;
  /** Custom render function for options */
  renderOption?: (
    option: AutocompleteOption,
    selected: boolean,
  ) => React.ReactNode;
  /** Custom render function for selected value display */
  renderValue?: (selected: AutocompleteOption[]) => React.ReactNode;
  /** Additional class for trigger button */
  className?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Width of the popover */
  popoverWidth?: string | number;
}

/**
 * Autocomplete - Searchable dropdown with suggestions
 *
 * A composable combobox component that supports:
 * - Single and multiple selection
 * - Async loading with search callback
 * - Custom option rendering
 * - Grouped options
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState("");
 * const options = [
 *   { value: "react", label: "React" },
 *   { value: "vue", label: "Vue" },
 *   { value: "angular", label: "Angular" },
 * ];
 *
 * <Autocomplete
 *   options={options}
 *   value={value}
 *   onValueChange={setValue}
 *   placeholder="Select framework..."
 * />
 * ```
 *
 * @example Multi-select with groups
 * ```tsx
 * <Autocomplete
 *   multiple
 *   options={[
 *     { value: "eth", label: "Ethereum", group: "Layer 1" },
 *     { value: "btc", label: "Bitcoin", group: "Layer 1" },
 *     { value: "arb", label: "Arbitrum", group: "Layer 2" },
 *   ]}
 *   value={selected}
 *   onValueChange={setSelected}
 * />
 * ```
 */
export function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  multiple = false,
  clearable = true,
  loading = false,
  disabled = false,
  filterFn,
  onSearchChange,
  minSearchLength = 0,
  renderOption,
  renderValue,
  className,
  size = "default",
  popoverWidth = "var(--radix-popover-trigger-width)",
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Normalize value to array for internal handling
  const selectedValues = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Get selected options
  const selectedOptions = React.useMemo(() => {
    return options.filter((opt) => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (search.length < minSearchLength) return options;

    const searchLower = search.toLowerCase();
    return options.filter((option) => {
      if (filterFn) return filterFn(option, search);
      return (
        option.label.toLowerCase().includes(searchLower) ||
        option.description?.toLowerCase().includes(searchLower)
      );
    });
  }, [options, search, filterFn, minSearchLength]);

  // Group options
  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string | undefined, AutocompleteOption[]>();
    filteredOptions.forEach((option) => {
      const group = option.group;
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(option);
    });
    return groups;
  }, [filteredOptions]);

  // Handle selection
  const handleSelect = React.useCallback(
    (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onValueChange?.(newValues);
      } else {
        onValueChange?.(optionValue === selectedValues[0] ? "" : optionValue);
        setOpen(false);
      }
    },
    [multiple, selectedValues, onValueChange],
  );

  // Handle clear
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.(multiple ? [] : "");
    },
    [multiple, onValueChange],
  );

  // Handle search change
  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  // Render display value
  const renderDisplayValue = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (renderValue) {
      return renderValue(selectedOptions);
    }

    if (multiple) {
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} selected`;
    }

    return (
      <span className="flex items-center gap-2 truncate">
        {selectedOptions[0].icon}
        {selectedOptions[0].label}
      </span>
    );
  };

  // Render option item
  const renderOptionItem = (
    option: AutocompleteOption,
    isSelected: boolean,
  ) => {
    if (renderOption) {
      return renderOption(option, isSelected);
    }

    return (
      <>
        <Check
          className={cn(
            "mr-2 h-4 w-4 shrink-0",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
        {option.icon && <span className="mr-2 shrink-0">{option.icon}</span>}
        <div className="flex flex-col">
          <span>{option.label}</span>
          {option.description && (
            <span className="text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </div>
      </>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            sizeClasses[size],
            !selectedOptions.length && "text-muted-foreground",
            className,
          )}
        >
          {renderDisplayValue()}
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {clearable && selectedOptions.length > 0 && !disabled && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
                aria-label="Clear selection"
              />
            )}
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin opacity-50" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: popoverWidth }}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {loading && filteredOptions.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              Array.from(groupedOptions.entries()).map(
                ([group, groupOptions]) => (
                  <CommandGroup key={group ?? "ungrouped"} heading={group}>
                    {groupOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          onSelect={() => handleSelect(option.value)}
                          className={cn(
                            "flex items-center",
                            isSelected && "bg-accent",
                          )}
                        >
                          {renderOptionItem(option, isSelected)}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ),
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

Autocomplete.displayName = "Autocomplete";

export { Autocomplete as Combobox };
