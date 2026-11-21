import type { LucideIcon } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfigProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  icon?: LucideIcon;
}
