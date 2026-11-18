import type { LucideIcon } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  icon?: LucideIcon;
}
