import { useState } from "react";
import type { Movie } from "../types/movieService";
import { searchMovies } from "../services/searchService";
import {
  filterMoviesByTitle,
  normalizeSearch,
  validateSearch,
} from "../utils/searchUtils";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

export function getNormalizedSearch(value: string): string | null {
  const normalized = normalizeSearch(value);

  return validateSearch(normalized) ? normalized : null;
}

export function useMovieSearch() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const clearSearch = () => {
    setMovies([]);
    setError(null);
    setHasSearched(false);
    setPage(1);
    setTotalPages(1);
  };

  const executeSearch = async (query: string, nextPage = 1) => {
    try {
      if (nextPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const data = await searchMovies(query, nextPage);
      const filteredMovies = filterMoviesByTitle(data.results, query);

      setMovies((prev) =>
        nextPage === 1 ? filteredMovies : [...prev, ...filteredMovies],
      );

      setPage(nextPage);
      setTotalPages(data.total_pages);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    const query = getNormalizedSearch(search);

    if (!query) {
      clearSearch();
      return;
    }

    setHasSearched(true);
    setPage(1);
    await executeSearch(query, 1);
  };

  const handleLoadMore = async () => {
    const query = getNormalizedSearch(search);

    if (!query || page >= totalPages || loadingMore) {
      return;
    }

    await executeSearch(query, page + 1);
  };

  return {
    search,
    setSearch,
    movies,
    loading,
    loadingMore,
    error,
    hasSearched,
    handleSearch,
    handleLoadMore,
    hasMore: page < totalPages,
    clearSearch,
  };
}
