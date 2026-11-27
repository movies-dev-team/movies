
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import MovieRatingControl from "../components/MovieRatingControl";
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

function getStarLabel(value: number) {
  return content.ratings.starLabel.replace(
    "{value}",
    String(value)
  );
}

describe("MovieRatingControl", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockGetRating.mockResolvedValue(8);
    mockSaveRating.mockResolvedValue(undefined);
  });

  it("should display a loading message while fetching the rating", () => {
    mockGetRating.mockReturnValueOnce(
      new Promise(() => {})
    );

    render(
      <MovieRatingControl movieId={movieId} />
    );

    expect(
      screen.getByText(content.ratings.loading)
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("group")
    ).not.toBeInTheDocument();
  });

  it("should display ten rating buttons", async () => {
    render(
      <MovieRatingControl movieId={movieId} />
    );

    const ratingGroup = await screen.findByRole(
      "group",
      {
        name: content.ratings.groupLabel,
      }
    );

    expect(
      within(ratingGroup).getAllByRole("button")
    ).toHaveLength(10);
  });

  it("should display the saved rating", async () => {
    render(
      <MovieRatingControl movieId={movieId} />
    );

    const selectedStar = await screen.findByRole(
      "button",
      {
        name: getStarLabel(8),
      }
    );

    expect(
      selectedStar.querySelector("svg")
    ).toHaveClass("fill-[#9634F5]");

    const nextStar = screen.getByRole("button", {
      name: getStarLabel(9),
    });

    expect(
      nextStar.querySelector("svg")
    ).toHaveClass("fill-transparent");
  });

  it("should display unselected stars when no rating exists", async () => {
    mockGetRating.mockResolvedValueOnce(0);

    render(
      <MovieRatingControl movieId={movieId} />
    );

    const ratingGroup = await screen.findByRole(
      "group",
      {
        name: content.ratings.groupLabel,
      }
    );

    const stars = within(ratingGroup).getAllByRole(
      "button"
    );

    for (const star of stars) {
      expect(
        star.querySelector("svg")
      ).toHaveClass("fill-transparent");
    }
  });

  it("should save a new movie rating", async () => {
    const user = userEvent.setup();

    mockGetRating.mockResolvedValueOnce(0);

    render(
      <MovieRatingControl movieId={movieId} />
    );

    const star = await screen.findByRole("button", {
      name: getStarLabel(7),
    });

    await user.click(star);

    await waitFor(() => {
      expect(mockSaveRating).toHaveBeenCalledWith(
        movieId,
        7
      );

      expect(toast.success).toHaveBeenCalledWith(
        content.ratings.saved
      );
    });

    await user.unhover(star);

    expect(
      star.querySelector("svg")
    ).toHaveClass("fill-[#9634F5]");
  });

  it("should update an existing movie rating", async () => {
    const user = userEvent.setup();

    render(
      <MovieRatingControl movieId={movieId} />
    );

    const star = await screen.findByRole("button", {
      name: getStarLabel(5),
    });

    await user.click(star);

    await waitFor(() => {
      expect(mockSaveRating).toHaveBeenCalledWith(
        movieId,
        5
      );

      expect(toast.success).toHaveBeenCalledWith(
        content.ratings.saved
      );
    });

    await user.unhover(star);

    const nextStar = screen.getByRole("button", {
      name: getStarLabel(6),
    });

    expect(
      star.querySelector("svg")
    ).toHaveClass("fill-[#9634F5]");

    expect(
      nextStar.querySelector("svg")
    ).toHaveClass("fill-transparent");
  });

  it("should preview a rating when hovering over a star", async () => {
    const user = userEvent.setup();

    mockGetRating.mockResolvedValueOnce(4);

    render(
      <MovieRatingControl movieId={movieId} />
    );

    const star = await screen.findByRole("button", {
      name: getStarLabel(7),
    });

    await user.hover(star);

    expect(
      star.querySelector("svg")
    ).toHaveClass("fill-[#9634F5]");

    await user.unhover(star);

    expect(
      star.querySelector("svg")
    ).toHaveClass("fill-transparent");

    expect(mockSaveRating).not.toHaveBeenCalled();
  });

  it("should preserve the previous rating when saving fails", async () => {
    const user = userEvent.setup();

    mockSaveRating.mockRejectedValueOnce(
      new Error("Save failed")
    );

    render(
      <MovieRatingControl movieId={movieId} />
    );

    const newStar = await screen.findByRole(
      "button",
      {
        name: getStarLabel(10),
      }
    );

    await user.click(newStar);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        content.ratings.saveError
      );
    });

    await user.unhover(newStar);

    const previousStar = screen.getByRole(
      "button",
      {
        name: getStarLabel(8),
      }
    );

    expect(
      previousStar.querySelector("svg")
    ).toHaveClass("fill-[#9634F5]");

    expect(
      newStar.querySelector("svg")
    ).toHaveClass("fill-transparent");
  });

  it("should display an error notification when loading the rating fails", async () => {
    mockGetRating.mockRejectedValueOnce(
      new Error("Load failed")
    );

    render(
      <MovieRatingControl movieId={movieId} />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        content.ratings.loadError
      );
    });

    expect(
      await screen.findByRole("group", {
        name: content.ratings.groupLabel,
      })
    ).toBeInTheDocument();
  });
});