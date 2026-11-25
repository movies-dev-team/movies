import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useMovieSearch } from "@/features/catalog/hooks/useMovieSearch";
import { searchMovies } from "@/features/catalog/services/searchService";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

import type { Movie, MoviesResponse } from "@/features/catalog/types/movieService";

vi.mock("@/features/catalog/services/searchService", () => ({
  searchMovies: vi.fn(),
}));

vi.mock("@/shared/utils/getApiErrorMessage", () => ({
  getApiErrorMessage: vi.fn(() => "Error de prueba"),
}));

// Helper para crear respuestas simuladas
function createResponse(
  results: Partial<Movie>[],
  page = 1,
  totalPages = 1,
): MoviesResponse {
  return {
    results: results as Movie[],
    page,
    total_pages: totalPages,
    total_results: results.length,
  } as MoviesResponse;
}

describe("useMovieSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with the correct state", () => {
    const { result } = renderHook(() => useMovieSearch());

    expect(result.current.search).toBe("");
    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.loadingMore).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  it("updates the search value", () => {
    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("Interstellar");
    });

    expect(result.current.search).toBe("Interstellar");
  });

  it("searches for movies successfully", async () => {
    const mockMovies = [
      {
        id: 1,
        title: "Interstellar",
        genre_ids: [878],
        vote_average: 8.5,
      },
    ];

    vi.mocked(searchMovies).mockResolvedValue(
      createResponse(mockMovies),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("Interstellar");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(searchMovies).toHaveBeenCalledWith("interstellar", 1);
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("does not search when the query is empty", async () => {
    const { result } = renderHook(() => useMovieSearch());

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(searchMovies).not.toHaveBeenCalled();
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.movies).toEqual([]);
  });

  it("normalizes the query before searching", async () => {
    vi.mocked(searchMovies).mockResolvedValue(
      createResponse([]),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("  AMÉLIE  ");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(searchMovies).toHaveBeenCalledWith("amelie", 1);
  });

  it("handles search errors", async () => {
    vi.mocked(searchMovies).mockRejectedValue(
      new Error("API error"),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("Batman");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(result.current.error).toBe("Error de prueba");
    expect(result.current.loading).toBe(false);
    expect(getApiErrorMessage).toHaveBeenCalled();
  });

  it("loads the next page of results", async () => {
    const firstPage = [
      {
        id: 1,
        title: "Batman Begins",
        genre_ids: [28],
        vote_average: 7.5,
      },
    ];

    const secondPage = [
      {
        id: 2,
        title: "Batman Returns",
        genre_ids: [28],
        vote_average: 7.8,
      },
    ];

    vi.mocked(searchMovies)
      .mockResolvedValueOnce(createResponse(firstPage, 1, 2))
      .mockResolvedValueOnce(createResponse(secondPage, 2, 2));

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("Batman");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(searchMovies).toHaveBeenNthCalledWith(1, "batman", 1);
    expect(searchMovies).toHaveBeenNthCalledWith(2, "batman", 2);
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
  });

  it("does not load more results when there are no more pages", async () => {
    vi.mocked(searchMovies).mockResolvedValue(
      createResponse([], 1, 1),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("Batman");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(searchMovies).toHaveBeenCalledTimes(1);
  });

  it("clears the search results and related state", async () => {
    vi.mocked(searchMovies).mockResolvedValue(
      createResponse(
        [
          {
            id: 1,
            title: "Batman",
            genre_ids: [28],
            vote_average: 7.5,
          },
        ],
        1,
        2,
      ),
    );

    const { result } = renderHook(() => useMovieSearch());

    act(() => {
      result.current.setSearch("Batman");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });
});