
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterProps } from "@/shared/types/filter";

export default function Filter({
  label,
  options,
  selectedValues,
  onChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(optionValue: string) {
    const isSelected = selectedValues.includes(optionValue);

    const updatedValues = isSelected
      ? selectedValues.filter((value) => value !== optionValue)
      : [...selectedValues, optionValue];

    onChange(updatedValues);
  }

  return (
    <div className="border rounded-xl p-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between font-semibold"
      >
        {label}
        <ChevronDown
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
