
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "@/lib/supabaseClient";
import {
  getMovieRating,
  saveMovieRating,
} from "../services/ratingsService";
import content from "@/data/content.json";

const {
  mockGetUser,
  mockFrom,
  mockSelect,
  mockEq,
  mockMaybeSingle,
  mockUpsert,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockSelect: vi.fn(),
  mockEq: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockUpsert: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  },
}));

const movieId = 157336;

const mockUser = {
  id: "user-123",
};

beforeEach(() => {
  vi.resetAllMocks();

  mockGetUser.mockResolvedValue({
    data: {
      user: mockUser,
    },
    error: null,
  });

  mockFrom.mockReturnValue({
    select: mockSelect,
    upsert: mockUpsert,
  });

  mockSelect.mockReturnValue({
    eq: mockEq,
  });

  mockEq.mockReturnValue({
    eq: mockEq,
    maybeSingle: mockMaybeSingle,
  });

  mockMaybeSingle.mockResolvedValue({
    data: {
      rating: 8,
    },
    error: null,
  });

  mockUpsert.mockResolvedValue({
    error: null,
  });
});

describe("getMovieRating", () => {
  it("should return the saved movie rating", async () => {
    const result = await getMovieRating(movieId);

    expect(result).toBe(8);
  });

  it("should request the rating for the authenticated user and movie", async () => {
    await getMovieRating(movieId);

    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);

    expect(mockFrom).toHaveBeenCalledWith("reviews");

    expect(mockSelect).toHaveBeenCalledWith("rating");

    expect(mockEq).toHaveBeenNthCalledWith(
      1,
      "user_id",
      mockUser.id
    );

    expect(mockEq).toHaveBeenNthCalledWith(
      2,
      "movie_id",
      movieId
    );

    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
  });

  it("should return zero when no rating exists", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const result = await getMovieRating(movieId);

    expect(result).toBe(0);
  });

  it("should return zero when the saved rating is null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        rating: null,
      },
      error: null,
    });

    const result = await getMovieRating(movieId);

    expect(result).toBe(0);
  });

  it("should reject when authentication fails", async () => {
    const authError = new Error("Authentication failed");

    mockGetUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: authError,
    });

    await expect(
      getMovieRating(movieId)
    ).rejects.toThrow("Authentication failed");

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("should reject when the user is not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: null,
    });

    await expect(
      getMovieRating(movieId)
    ).rejects.toThrow(
      content.auth.messages.unauthenticated
    );

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("should reject when the database request fails", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: new Error("Database request failed"),
    });

    await expect(
      getMovieRating(movieId)
    ).rejects.toThrow("Database request failed");
  });
});

describe("saveMovieRating", () => {
  it("should save a movie rating for the authenticated user", async () => {
    await saveMovieRating(movieId, 8);

    expect(mockFrom).toHaveBeenCalledWith("reviews");

    expect(mockUpsert).toHaveBeenCalledWith(
      {
        user_id: mockUser.id,
        movie_id: movieId,
        rating: 8,
        updated_at: expect.any(String),
      },
      {
        onConflict: "user_id,movie_id",
      }
    );

    expect(mockUpsert).toHaveBeenCalledTimes(1);
  });

  it("should update an existing movie rating", async () => {
    await saveMovieRating(movieId, 6);
    await saveMovieRating(movieId, 9);

    expect(mockUpsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        user_id: mockUser.id,
        movie_id: movieId,
        rating: 9,
      }),
      {
        onConflict: "user_id,movie_id",
      }
    );

    expect(mockUpsert).toHaveBeenCalledTimes(2);
  });

  it.each([1, 10])(
    "should accept the valid boundary rating %s",
    async (rating) => {
      await saveMovieRating(movieId, rating);

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          rating,
        }),
        {
          onConflict: "user_id,movie_id",
        }
      );
    }
  );

  it.each([0, -1, 11, 5.5, NaN, Infinity])(
    "should reject the invalid rating %s",
    async (rating) => {
      await expect(
        saveMovieRating(movieId, rating)
      ).rejects.toThrow(
        content.ratings.invalidRating
      );

      expect(mockGetUser).not.toHaveBeenCalled();
      expect(mockUpsert).not.toHaveBeenCalled();
    }
  );

  it("should reject when authentication fails", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: new Error("Authentication failed"),
    });

    await expect(
      saveMovieRating(movieId, 8)
    ).rejects.toThrow("Authentication failed");

    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("should reject when the user is not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: null,
    });

    await expect(
      saveMovieRating(movieId, 8)
    ).rejects.toThrow(
      content.auth.messages.unauthenticated
    );

    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("should reject when the database cannot save the rating", async () => {
    mockUpsert.mockResolvedValueOnce({
      error: new Error("Database save failed"),
    });

    await expect(
      saveMovieRating(movieId, 8)
    ).rejects.toThrow("Database save failed");
  });
});