import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchMovies } from "@/features/catalog/services/searchService";
import { getData } from "@/shared/services/tmdbService";

vi.mock("@/shared/services/tmdbService", () => ({
  getData: vi.fn(),
}));

describe("searchMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls getData with the correct search parameters", async () => {
    vi.mocked(getData).mockResolvedValue({
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    });

    await searchMovies("Interstellar");

    expect(getData).toHaveBeenCalledWith(
      "search/movie",
      {
        query: "Interstellar",
        include_adult: false,
      },
      1,
    );
  });

  it("uses the requested page", async () => {
    vi.mocked(getData).mockResolvedValue({
      results: [],
      page: 3,
      total_pages: 3,
      total_results: 0,
    });

    await searchMovies("Batman", 3);

    expect(getData).toHaveBeenCalledWith(
      "search/movie",
      {
        query: "Batman",
        include_adult: false,
      },
      3,
    );
  });

  it("uses page 1 by default", async () => {
    vi.mocked(getData).mockResolvedValue({
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    });

    await searchMovies("Avatar");

    expect(getData).toHaveBeenCalledWith(
      "search/movie",
      {
        query: "Avatar",
        include_adult: false,
      },
      1,
    );
  });

  it("returns the response from getData", async () => {
    const mockResponse = {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };

    vi.mocked(getData).mockResolvedValue(mockResponse);

    const result = await searchMovies("Titanic");

    expect(result).toEqual(mockResponse);
  });
});