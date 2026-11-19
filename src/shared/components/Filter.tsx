import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { FilterProps } from "@/shared/types/filter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Filter({
  label,
  options,
  selectedValues,
  onChange,
  icon: Icon,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(optionValue: string) {
    const isSelected = selectedValues.includes(optionValue);
    onChange(isSelected ? [] : [optionValue]);
  }

  return (
    <Card
      size="sm"
      className="gap-0 border border-border/40 bg-transparent py-1 shadow-none hover:border-brand-light hover:shadow-none"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold transition-colors hover:text-brand-light"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-5 shrink-0 text-brand-light" />}
          {label}
        </span>

        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2 px-4 pb-4">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={isSelected ? "default" : "secondary"}
                aria-pressed={isSelected}
                onClick={() => handleChange(option.value)}
                className={`h-auto min-h-8 w-full min-w-0 whitespace-normal rounded-full border border-border/40 px-2 py-1.5 text-xs leading-tight shadow-none ${
                  isSelected
                    ? "bg-brand-primary text-white hover:bg-brand-primary"
                    : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <span className="block w-full text-center">{option.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
