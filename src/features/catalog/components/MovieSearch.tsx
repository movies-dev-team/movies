import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MovieSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function MovieSearch({
  value,
  onChange,
  onSearch,
}: MovieSearchProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
          aria-hidden="true"
        />

        <Input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar películas..."
          aria-label="Buscar películas"
          className="h-12 pl-11"
        />
      </div>
    </form>
  );
}
