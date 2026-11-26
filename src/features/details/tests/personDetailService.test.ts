import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmdbApi } from "@/shared/services/tmdbApi";
import { getPersonDetail } from "../services/personDetailService";

vi.mock("@/shared/services/tmdbApi", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

const mockGet = vi.mocked(tmdbApi.get);

describe("getPersonDetail", () => {

  const personId = 1892;

  const mockPerson = {
    id: personId,
    name: "Matt Damon",
    biography: "Actor y guionista estadounidense.",
    birthday: "1970-10-08",
    place_of_birth: "Cambridge, Massachusetts, USA",
    movie_credits: {
      cast: [],
      crew: [],
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should request the person details with the correct parameters", async () => {

    mockGet.mockResolvedValue({ data: mockPerson });

    await getPersonDetail(personId);

    expect(mockGet).toHaveBeenCalledTimes(1);

    expect(mockGet).toHaveBeenCalledWith(`person/${personId}`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        append_to_response: "movie_credits",
        language: "es-ES",
      },
    });
  });

  it("should return the person details", async () => {

    mockGet.mockResolvedValue({ data: mockPerson });

    const result = await getPersonDetail(personId);

    expect(result).toEqual(mockPerson);
  });

  it("should reject when the API request fails", async () => {

    mockGet.mockRejectedValue(new Error("API request failed"));

    await expect(getPersonDetail(personId)).rejects.toThrow(
      "API request failed"
    );
  });
});