import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { FilterConfigProps } from "@/shared/types/filter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorMessage from "./ErrorMessage";

export default function Filter({
  title,
  options,
  selectedValues,
  onChange,
  icon: Icon,
  loading = false,
  emptyMessage,
}: FilterConfigProps) {
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
        className="flex w-full items-center justify-between px-3 py-3 text-base font-semibold transition-colors hover:text-brand-light"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-6 shrink-0 text-brand-light" />}
          {title}
        </span>

        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2.5 px-4 pb-4">
          {loading ? (
            <p className="col-span-2 text-base text-muted-foreground">
              Cargando géneros...
            </p>
          ) : options.length === 0 ? (
            <div className="col-span-2">
              {emptyMessage && <ErrorMessage message={emptyMessage} />}
            </div>
          ) : (
            options.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "secondary"}
                  aria-pressed={isSelected}
                  onClick={() => handleChange(option.value)}
                  className={`h-auto min-h-10 w-full min-w-0 whitespace-normal rounded-full border border-border/40 px-3 py-2 text-base leading-tight shadow-none ${
                    isSelected
                      ? "bg-brand-primary text-white hover:bg-brand-primary"
                      : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <span className="block w-full text-center">
                    {option.label}
                  </span>
                </Button>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}
