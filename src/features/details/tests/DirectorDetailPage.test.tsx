
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import DirectorDetailPage from "../pages/DirectorDetailPage";
import { tmdbApi } from "@/shared/services/tmdbApi";
import { mockDirector } from "./fixtures/personFixtures";
import content from "@/data/content.json";

vi.mock("@/shared/services/tmdbApi", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

const mockGet = vi.mocked(tmdbApi.get);

function renderDirectorDetailPage(
  id = String(mockDirector.id),
  fromMovieId?: number
) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: `/app/director/${id}`,
          state: { fromMovieId },
        },
      ]}
    >
      <Routes>
        <Route
          path="/app/director/:id"
          element={<DirectorDetailPage />}
        />
        <Route
          path="/app/movie/:id"
          element={<h1>MovieDetailPage</h1>}
        />
        <Route
          path="/app"
          element={<h1>CatalogPage</h1>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("DirectorDetailPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should display a loading message while fetching director details", () => {
    mockGet.mockReturnValueOnce(new Promise(() => {}));

    renderDirectorDetailPage();

    expect(
      screen.getByText(content.loading.generic)
    ).toBeInTheDocument();
  });

  it("should display the director name and biography", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockDirector,
    });

    renderDirectorDetailPage();

    expect(
      await screen.findByRole("heading", {
        name: mockDirector.name,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockDirector.biography)
    ).toBeInTheDocument();
  });

  it("should display only movies directed by the director", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockDirector,
    });

    renderDirectorDetailPage();

    const filmography = await screen.findByRole("region", {
      name: content.movieDetail.filmography,
    });

    expect(
      within(filmography).getByRole("link", {
        name: /Interstellar/i,
      })
    ).toBeInTheDocument();

    expect(
      within(filmography).getByRole("link", {
        name: /Inception/i,
      })
    ).toBeInTheDocument();

    expect(
      within(filmography).getByRole("link", {
        name: /Oppenheimer/i,
      })
    ).toBeInTheDocument();

    expect(
      within(filmography).queryByText(/Producer Movie/i)
    ).not.toBeInTheDocument();

    expect(
      within(filmography).queryByText(/Writer Movie/i)
    ).not.toBeInTheDocument();

    expect(
      within(filmography).queryByText(/Acting Movie/i)
    ).not.toBeInTheDocument();

    expect(
      within(filmography).getAllByRole("link")
    ).toHaveLength(3);
  });

  it("should display a message when no directed movies are available", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        ...mockDirector,
        movie_credits: {
          ...mockDirector.movie_credits,
          crew: mockDirector.movie_credits.crew.filter(
            (credit) => credit.job !== "Director"
          ),
        },
      },
    });

    renderDirectorDetailPage();

    expect(
      await screen.findByText(
        content.movieDetail.moviesNotAvailable
      )
    ).toBeInTheDocument();
  });

  it("should navigate to a movie selected from the filmography", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: mockDirector,
    });

    renderDirectorDetailPage();

    const movieLink = await screen.findByRole("link", {
      name: /Inception/i,
    });

    expect(movieLink).toHaveAttribute(
      "href",
      "/app/movie/27205"
    );

    await user.click(movieLink);

    expect(
      await screen.findByRole("heading", {
        name: "MovieDetailPage",
      })
    ).toBeInTheDocument();
  });

  it("should display an error when the director request fails", async () => {
    mockGet.mockRejectedValueOnce(
      new Error("API request failed")
    );

    renderDirectorDetailPage();

    expect(
      await screen.findByRole("alert")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: mockDirector.name,
      })
    ).not.toBeInTheDocument();
  });

  it("should display an error for an invalid director ID", async () => {
    renderDirectorDetailPage("invalid");

    expect(
      await screen.findByText(
        content.movieDetail.directorNotFound
      )
    ).toBeInTheDocument();

    expect(mockGet).not.toHaveBeenCalled();
  });

  it("should navigate back to the original movie", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: mockDirector,
    });

    renderDirectorDetailPage(
      String(mockDirector.id),
      157336
    );

    const backLink = await screen.findByRole("link", {
      name: content.navigation.backToMovieDetail,
    });

    expect(backLink).toHaveAttribute(
      "href",
      "/app/movie/157336"
    );

    await user.click(backLink);

    expect(
      await screen.findByRole("heading", {
        name: "MovieDetailPage",
      })
    ).toBeInTheDocument();
  });

  it("should navigate back to the catalog when there is no original movie", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: mockDirector,
    });

    renderDirectorDetailPage();

    const backLink = await screen.findByRole("link", {
      name: content.navigation.backToCatalog,
    });

    expect(backLink).toHaveAttribute("href", "/app");

    await user.click(backLink);

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument();
  });
});