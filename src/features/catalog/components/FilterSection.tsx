import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { FilterSectionProps } from "../types/CatalogFilters";

export default function FilterSection({
  icon,
  title,
  selectedLabel,
  children,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = icon;
  return (
    <Card
      size="sm"
      className="gap-0 border border-border/40 bg-transparent py-1 shadow-none hover:border-brand-light hover:shadow-none"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-1 px-2 py-3 text-sm font-semibold transition-colors hover:text-brand-light md:px-3 md:text-base"
      >
        <span className="flex flex-wrap items-center gap-2">
          <Icon className="size-5 shrink-0 text-brand-light md:size-6" />{" "}
          {title}
          {selectedLabel && (
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-xs font-medium text-white">
              {selectedLabel}
            </span>
          )}
        </span>

        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          onClick={() => {
            if (window.matchMedia("(max-width: 767px)").matches) {
              setIsOpen(false);
            }
          }}
          className="mt-3 grid grid-cols-1 gap-2.5 px-3 pb-4 md:grid-cols-2"
        >
          {children}
        </div>
      )}
    </Card>
  );
}
