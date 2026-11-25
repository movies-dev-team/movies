
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import MovieDetailPage from "../pages/MovieDetailPage";
import { tmdbApi } from "@/shared/services/tmdbApi";
import type { MovieDetail } from "../types/movieDetail";
import content from "@/data/content.json";

vi.mock("@/shared/services/tmdbApi", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

vi.mock("@/shared/components/FavoriteButton", () => ({
  default: () => null,
}));

vi.mock("../components/MovieRatingControl", () => ({
  default: () => null,
}));

const mockGet = vi.mocked(tmdbApi.get);

const movieId = 157336;

const mockMovie: MovieDetail = {
  id: movieId,
  title: "Interstellar",
  original_title: "Interstellar",
  overview: "Un grupo de exploradores viaja por el espacio.",
  poster_path: "/interstellar.jpg",
  release_date: "2014-11-07",
  runtime: 169,
  vote_average: 8.5,
  original_language: "en",
  origin_country: ["US"],
  genres: [
    { id: 878, name: "Ciencia ficción" },
    { id: 18, name: "Drama" },
  ],
  production_companies: [
    { id: 923, name: "Legendary Pictures" },
  ],
  credits: {
    cast: [
      {
        id: 10297,
        name: "Matthew McConaughey",
        original_name: "Matthew McConaughey",
        character: "Cooper",
        profile_path: "/matthew.jpg",
        order: 0,
      },
      {
        id: 1813,
        name: "Anne Hathaway",
        original_name: "Anne Hathaway",
        character: "Brand",
        profile_path: null,
        order: 1,
      },
    ],
    crew: [
      {
        id: 525,
        name: "Christopher Nolan",
        original_name: "Christopher Nolan",
        profile_path: "/nolan.jpg",
        department: "Directing",
        job: "Director",
        order: 0,
      },
    ],
  },
};

const mockTrailer = {
  key: "interstellar-trailer",
  name: "Interstellar Official Trailer",
  type: "Trailer",
  official: true,
  site: "YouTube",
};

function mockSuccessfulRequests(movie = mockMovie) {
  mockGet
    .mockResolvedValueOnce({
      data: movie,
    })
    .mockResolvedValueOnce({
      data: {
        results: [mockTrailer],
      },
    });
}

function renderMovieDetailPage(id = String(movieId)) {
  return render(
    <MemoryRouter initialEntries={[`/app/movie/${id}`]}>
      <Routes>
        <Route
          path="/app/movie/:id"
          element={<MovieDetailPage />}
        />
        <Route
          path="/app"
          element={<h1>CatalogPage</h1>}
        />
        <Route
          path="/app/actor/:id"
          element={<h1>ActorDetailPage</h1>}
        />
        <Route
          path="/app/director/:id"
          element={<h1>DirectorDetailPage</h1>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("MovieDetailPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should display a loading message while fetching movie details", () => {
    mockGet.mockReturnValueOnce(new Promise(() => {}));

    renderMovieDetailPage();

    expect(
      screen.getByText(content.loading.movie)
    ).toBeInTheDocument();
  });

  it("should display the movie title and overview", async () => {
    mockSuccessfulRequests();

    renderMovieDetailPage();

    expect(
      await screen.findByRole("heading", {
        name: mockMovie.title,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockMovie.overview)
    ).toBeInTheDocument();
  });

  it("should display the movie poster and runtime", async () => {
    mockSuccessfulRequests();

    renderMovieDetailPage();

    const poster = await screen.findByRole("img", {
      name: `Póster de la película ${mockMovie.original_title}`,
    });

    expect(poster).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300${mockMovie.poster_path}`
    );

    expect(screen.getByText("2h 49min")).toBeInTheDocument();
  });

  it("should display the movie technical information", async () => {
    mockSuccessfulRequests();

    renderMovieDetailPage();

    expect(
      await screen.findByRole("link", {
        name: "Christopher Nolan",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(content.movieDetail.releaseDate)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Legendary Pictures")
    ).toBeInTheDocument();

    expect(
      screen.getByText("inglés")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Estados Unidos")
    ).toBeInTheDocument();
  });

  it("should display the movie cast", async () => {
    mockSuccessfulRequests();

    renderMovieDetailPage();

    expect(
      await screen.findByText("Matthew McConaughey")
    ).toBeInTheDocument();

    expect(screen.getByText("Cooper")).toBeInTheDocument();
    expect(screen.getByText("Anne Hathaway")).toBeInTheDocument();
    expect(screen.getByText("Brand")).toBeInTheDocument();
  });

  it("should display the official movie trailer", async () => {
    mockSuccessfulRequests();

    renderMovieDetailPage();

    const trailer = await screen.findByTitle(mockTrailer.name);

    expect(trailer).toBeInTheDocument();

    expect(trailer).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${mockTrailer.key}`
    );
  });

  it("should display a message when no trailer is available", async () => {
    mockGet
      .mockResolvedValueOnce({
        data: mockMovie,
      })
      .mockResolvedValueOnce({
        data: { results: [] },
      })
      .mockResolvedValueOnce({
        data: { results: [] },
      });

    renderMovieDetailPage();

    expect(
      await screen.findByText(content.movieDetail.noTrailer)
    ).toBeInTheDocument();

    expect(
      screen.queryByTitle(mockTrailer.name)
    ).not.toBeInTheDocument();
  });

  it("should navigate to the actor detail page", async () => {
    const user = userEvent.setup();

    mockSuccessfulRequests();

    renderMovieDetailPage();

    const actorLink = await screen.findByRole("link", {
      name: /Matthew McConaughey/i,
    });

    expect(actorLink).toHaveAttribute(
      "href",
      "/app/actor/10297"
    );

    await user.click(actorLink);

    expect(
      await screen.findByRole("heading", {
        name: "ActorDetailPage",
      })
    ).toBeInTheDocument();
  });

  it("should navigate to the director detail page", async () => {
    const user = userEvent.setup();

    mockSuccessfulRequests();

    renderMovieDetailPage();

    const directorLink = await screen.findByRole("link", {
      name: "Christopher Nolan",
    });

    expect(directorLink).toHaveAttribute(
      "href",
      "/app/director/525"
    );

    await user.click(directorLink);

    expect(
      await screen.findByRole("heading", {
        name: "DirectorDetailPage",
      })
    ).toBeInTheDocument();
  });

  it("should display an error when the movie request fails", async () => {
    mockGet.mockRejectedValueOnce(
      new Error("API request failed")
    );

    renderMovieDetailPage();

    expect(
      await screen.findByRole("alert")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: mockMovie.title,
      })
    ).not.toBeInTheDocument();
  });

  it("should display an error for an invalid movie ID", async () => {
    renderMovieDetailPage("invalid");

    expect(
      await screen.findByText(content.errors.notFound)
    ).toBeInTheDocument();

    expect(mockGet).not.toHaveBeenCalled();
  });

  it("should navigate back to the catalog", async () => {
    const user = userEvent.setup();

    mockSuccessfulRequests();

    renderMovieDetailPage();

    const backLink = await screen.findByRole("link", {
      name: content.navigation.backToCatalog,
    });

    await user.click(backLink);

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument();
  });
});
