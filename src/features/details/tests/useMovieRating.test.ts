
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useMovieRating } from "../services/hooks/useMovieRating";
import {
  getMovieRating,
  saveMovieRating,
} from "../services/ratingsService";
import content from "@/data/content.json";

vi.mock("../services/ratingsService", () => ({
  getMovieRating: vi.fn(),
  saveMovieRating: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockGetRating = vi.mocked(getMovieRating);
const mockSaveRating = vi.mocked(saveMovieRating);

const movieId = 157336;

describe("useMovieRating", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockGetRating.mockResolvedValue(8);
    mockSaveRating.mockResolvedValue(undefined);
  });

  it("should initially be loading the movie rating", () => {
    mockGetRating.mockReturnValueOnce(
      new Promise(() => {})
    );

    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    expect(result.current.rating).toBe(0);
    expect(result.current.loading).toBe(true);
    expect(result.current.saving).toBe(false);
  });

  it("should load the saved movie rating", async () => {
    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rating).toBe(8);

    expect(mockGetRating).toHaveBeenCalledWith(movieId);
  });

  it("should return zero when no rating exists", async () => {
    mockGetRating.mockResolvedValueOnce(0);

    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rating).toBe(0);
  });

  it("should display an error notification when loading fails", async () => {
    mockGetRating.mockRejectedValueOnce(
      new Error("Load failed")
    );

    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith(
      content.ratings.loadError
    );
  });

  it("should update the rating and display a success notification", async () => {
    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateRating(9);
    });

    expect(mockSaveRating).toHaveBeenCalledWith(
      movieId,
      9
    );

    expect(result.current.rating).toBe(9);
    expect(result.current.saving).toBe(false);

    expect(toast.success).toHaveBeenCalledWith(
      content.ratings.saved
    );
  });

  it("should preserve the previous rating when saving fails", async () => {
    mockSaveRating.mockRejectedValueOnce(
      new Error("Save failed")
    );

    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateRating(10);
    });

    expect(result.current.rating).toBe(8);
    expect(result.current.saving).toBe(false);

    expect(toast.error).toHaveBeenCalledWith(
      content.ratings.saveError
    );

    expect(toast.success).not.toHaveBeenCalled();
  });

  it("should not save a rating while loading", async () => {
    mockGetRating.mockReturnValueOnce(
      new Promise(() => {})
    );

    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await act(async () => {
      await result.current.updateRating(9);
    });

    expect(mockSaveRating).not.toHaveBeenCalled();
  });

  it("should prevent simultaneous rating updates", async () => {
    let resolveSave!: () => void;

    mockSaveRating.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveSave = resolve;
      })
    );

    const { result } = renderHook(() =>
      useMovieRating(movieId)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let pendingSave!: Promise<void>;

    act(() => {
      pendingSave = result.current.updateRating(9);
    });

    expect(result.current.saving).toBe(true);

    await act(async () => {
      await result.current.updateRating(10);
    });

    expect(mockSaveRating).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSave();
      await pendingSave;
    });

    expect(result.current.rating).toBe(9);
    expect(result.current.saving).toBe(false);
  });

  it("should reload the rating when the movie ID changes", async () => {
    mockGetRating
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(5);

    const { result, rerender } = renderHook(
      ({ id }) => useMovieRating(id),
      {
        initialProps: {
          id: movieId,
        },
      }
    );

    await waitFor(() => {
      expect(result.current.rating).toBe(8);
    });

    rerender({
      id: 27205,
    });

    await waitFor(() => {
      expect(result.current.rating).toBe(5);
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetRating).toHaveBeenNthCalledWith(
      2,
      27205
    );
  });

  it("should ignore an outdated rating request", async () => {
    let resolveOldRating!: (rating: number) => void;

    mockGetRating
      .mockReturnValueOnce(
        new Promise<number>((resolve) => {
          resolveOldRating = resolve;
        })
      )
      .mockResolvedValueOnce(5);

    const { result, rerender } = renderHook(
      ({ id }) => useMovieRating(id),
      {
        initialProps: {
          id: movieId,
        },
      }
    );

    rerender({
      id: 27205,
    });

    await waitFor(() => {
      expect(result.current.rating).toBe(5);
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      resolveOldRating(8);
    });

    expect(result.current.rating).toBe(5);
  });
});