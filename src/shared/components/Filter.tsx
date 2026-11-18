import { useState } from "react";
import { ChevronDown} from "lucide-react";

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
      className="gap-0 border-border-hover bg-gradient-panel py-2 shadow-small hover:shadow-brand-glow"
    >
     
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold hover:text-brand-light"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-5 shrink-0 text-brand-light" />}
          {label}
        </span>

        <ChevronDown
          className={`size-5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      
      {isOpen && (
        <div className="mt-2 grid grid-cols-2 gap-2 px-3 pb-2">
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
                className={`h-auto min-h-8 min-w-0 whitespace-normal px-2 py-1.5 text-xs leading-tight ${
                  isSelected
                    ? "border-brand-light text-brand-soft shadow-brand-glow"
                    : "border-border-hover hover:border-brand-light"
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
