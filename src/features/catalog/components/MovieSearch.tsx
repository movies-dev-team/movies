import type { SubmitEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import content from "@/data/content.json";
import type { MovieSearchProps } from "../types/searchService";

export default function MovieSearch({
  value,
  onChange,
  onSearch,
}: MovieSearchProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      role="search"
      aria-label="Buscar películas"
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2  text-muted-foreground"
          size={18}
          aria-hidden="true"
        />

        <Input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={content.search.searchLabel}
          aria-label={content.search.label}
          className="h-12 pl-11 [&::-webkit-search-cancel-button]:cursor-pointer"
        />
      </div>
    </form>
  );
}
