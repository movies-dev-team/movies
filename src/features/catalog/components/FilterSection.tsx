import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FilterSectionProps } from "../types/CatalogFilters";

export default function FilterSection({
  icon,
  title,
  selectedLabel,
  children,
  isOpen,
  onToggle,
  alignRight,
}: FilterSectionProps) {
  const Icon = icon;
  return (
    <Card
      size="sm"
      className={`relative overflow-visible gap-0 border border-border/40 bg-transparent py-1 shadow-none hover:border-brand-light hover:shadow-none ${
        isOpen ? "z-30" : "z-0"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-1 gap-y-1 px-2 py-3 text-xs font-semibold transition-colors hover:text-brand-light md:px-3 md:text-base"
      >
        <span className="flex min-w-0 items-center gap-1">
          <Icon className="size-5 shrink-0 text-brand-light md:size-6" />
          <span className="truncate">{title}</span>
        </span>

        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 md:size-5 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {selectedLabel && (
          <span className="col-span-2 max-w-full justify-self-start truncate rounded-full bg-brand-primary px-2 py-0.5 text-xs font-medium text-white">
            {selectedLabel}
          </span>
        )}
      </button>
      {isOpen && (
        <div
          className={`absolute top-full z-50 mt-2 grid w-[200%] max-w-[calc(100vw-2rem)] grid-cols-2 gap-2.5 rounded-xl border border-border/40 bg-card p-3 shadow-xl md:static md:mt-3 md:w-full md:max-w-none md:rounded-none md:border-0 md:bg-transparent md:px-3 md:py-2 md:shadow-none ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </Card>
  );
}
