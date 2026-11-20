
import { useEffect, useState } from "react";
import { Clapperboard, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { getMovieGenres } from "../services/movieService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

import type { Genre } from "@/shared/types/movie";
import type { FilterGenresProps } from "../types/CatalogFilters";
import type { FilterOption } from "@/shared/types/filter";
import content from "@/data/content.json";

export default function FilterGenres({
  selectedGenres,
  onChange,
}: FilterGenresProps) {
  const [genres, setGenres] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data: Genre[] = await getMovieGenres();

        const options = data.map((genre) => ({
          label: genre.name,
          value: String(genre.id),
        }));

        setGenres(options);
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  function handleChange(optionValue: string) {
    const isSelected = selectedGenres.includes(optionValue);
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
          <Clapperboard className="size-6 shrink-0 text-brand-light" />
          {content.filters.filterGenres}
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
          ) : genres.length === 0 ? (
            <div className="col-span-2">
              <ErrorMessage
                message={
                  error ?? "No hay géneros disponibles."
                }
              />
            </div>
          ) : (
            genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre.value);

              return (
                <Button
                  key={genre.value}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "secondary"}
                  aria-pressed={isSelected}
                  onClick={() => handleChange(genre.value)}
                  className={`h-auto min-h-10 w-full min-w-0 whitespace-normal rounded-full border border-border/40 px-3 py-2 text-base leading-tight shadow-none ${
                    isSelected
                      ? "bg-brand-primary text-white hover:bg-brand-primary"
                      : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <span className="block w-full text-center">
                    {genre.label}
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
