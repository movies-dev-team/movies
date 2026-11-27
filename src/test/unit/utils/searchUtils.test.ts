import { describe, it, expect } from "vitest";
import type { Movie } from "@/features/catalog/types/movieService";
import type { CatalogFilterValues } from "@/features/catalog/types/CatalogFilters";

import {
  normalizeSearch,
  validateSearch,
  filterMoviesByTitle,
  filterSearchResults,
} from "@/features/catalog/utils/searchUtils";

function createMovie(
  title: string,
  genre_ids: number[] = [],
  vote_average: number = 7,
): Movie {
  return {
    title,
    genre_ids,
    vote_average,
  } as Movie;
}

describe("normalizeSearch", () => {
  it("trims whitespace and converts text to lowercase", () => {
    expect(normalizeSearch("  INTERSTELLAR  ")).toBe("interstellar");
  });

  it("removes accents", () => {
    expect(normalizeSearch("Amélie")).toBe("amelie");
  });

  it("normalizes accented uppercase characters", () => {
    expect(normalizeSearch("ÉXITO")).toBe("exito");
  });
});

describe("validateSearch", () => {
  it("returns true for a non-empty search", () => {
    expect(validateSearch("batman")).toBe(true);
  });

  it("returns false for an empty search", () => {
    expect(validateSearch("")).toBe(false);
  });
});

describe("filterMoviesByTitle", () => {
  const movies = [
    createMovie("Interstellar"),
    createMovie("Batman Begins"),
    createMovie("Amélie"),
  ];

  it("filters movies by title", () => {
    const result = filterMoviesByTitle(movies, "batman");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Batman Begins");
  });

  it("matches partial titles", () => {
    const result = filterMoviesByTitle(movies, "inter");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Interstellar");
  });

  it("matches titles regardless of accents", () => {
    const result = filterMoviesByTitle(movies, "amelie");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Amélie");
  });

  it("returns an empty array when there are no matches", () => {
    const result = filterMoviesByTitle(movies, "spiderman");

    expect(result).toEqual([]);
  });
});

describe("filterSearchResults", () => {
  const movies = [
    createMovie("Interstellar", [12, 878], 8.5),
    createMovie("Batman", [28, 80], 7.5),
    createMovie("Titanic", [18], 7.9),
  ];

  it("returns all movies when no filters are applied", () => {
    const filters = {} as CatalogFilterValues;

    expect(filterSearchResults(movies, filters)).toHaveLength(3);
  });

  it("filters movies by genre", () => {
    const filters = {
      genre: "878",
    } as CatalogFilterValues;

    const result = filterSearchResults(movies, filters);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Interstellar");
  });

  it("filters movies by minimum rating", () => {
    const filters = {
      minRating: 8,
    } as CatalogFilterValues;

    const result = filterSearchResults(movies, filters);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Interstellar");
  });

  it("filters movies by maximum rating", () => {
    const filters = {
      maxRating: 7.8,
    } as CatalogFilterValues;

    const result = filterSearchResults(movies, filters);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Batman");
  });

  it("combines genre and rating filters", () => {
    const filters = {
      genre: "12",
      minRating: 8,
    } as CatalogFilterValues;

    const result = filterSearchResults(movies, filters);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Interstellar");
  });
});
