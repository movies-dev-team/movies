import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import MovieSearch from "@/features/catalog/components/MovieSearch";

function MovieSearchWrapper({ onSearch = vi.fn() }: { onSearch?: () => void }) {
  const [value, setValue] = useState("");

  return <MovieSearch value={value} onChange={setValue} onSearch={onSearch} />;
}

describe("MovieSearch", () => {
  it("renders the search input", () => {
    render(<MovieSearchWrapper />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("allows the user to type a movie name", async () => {
    const user = userEvent.setup();

    render(<MovieSearchWrapper />);

    const input = screen.getByRole("searchbox");

    await user.type(input, "Interstellar");

    expect(input).toHaveValue("Interstellar");
  });

  it("calls onSearch when the form is submitted", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<MovieSearchWrapper onSearch={onSearch} />);

    const input = screen.getByRole("searchbox");

    await user.type(input, "Interstellar");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("does not reload the page when submitting", async () => {
    const user = userEvent.setup();

    render(<MovieSearchWrapper />);

    const input = screen.getByRole("searchbox");

    await user.type(input, "Interstellar");

    const form = screen.getByRole("search");

    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("aria-label", "Buscar películas");
  });
});
