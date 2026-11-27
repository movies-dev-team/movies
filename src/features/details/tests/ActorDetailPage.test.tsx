
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import ActorDetailPage from "../pages/ActorDetailPage";
import { tmdbApi } from "@/shared/services/tmdbApi";
import { MAX_MOVIES_PER_PROFILE } from "@/shared/constants/movieConstants";
import { mockActor } from "./fixtures/personFixtures";
import content from "@/data/content.json";

vi.mock("@/shared/services/tmdbApi", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

const mockGet = vi.mocked(tmdbApi.get);

function renderActorDetailPage(
  id = String(mockActor.id),
  fromMovieId?: number
) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: `/app/actor/${id}`,
          state: { fromMovieId },
        },
      ]}
    >
      <Routes>
        <Route
          path="/app/actor/:id"
          element={<ActorDetailPage />}
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

describe("ActorDetailPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should display a loading message while fetching actor details", () => {
    mockGet.mockReturnValueOnce(new Promise(() => {}));

    renderActorDetailPage();

    expect(
      screen.getByText(content.loading.generic)
    ).toBeInTheDocument();
  });

  it("should display the actor name and biography", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage();

    expect(
      await screen.findByRole("heading", {
        name: mockActor.name,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockActor.biography)
    ).toBeInTheDocument();

    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it("should display the actor profile picture", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage();

    const picture = await screen.findByRole("img", {
      name: `${content.movieDetail.pictureOf} ${mockActor.name}`,
    });

    expect(picture).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${mockActor.profile_path}`
    );
  });

  it("should display the actor birth date and birthplace", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage();

    await screen.findByRole("heading", {
      name: mockActor.name,
    });

    const birthDate = screen.getByText(
      `${content.movieDetail.birthDate}:`,
      { exact: false }
    );

    expect(birthDate.querySelector("time")).toHaveAttribute(
      "datetime",
      mockActor.birthday!
    );

    expect(
      screen.getByText(
        `${content.movieDetail.birthPlace}: ${mockActor.place_of_birth}`
      )
    ).toBeInTheDocument();
  });

  it("should not display unavailable personal information", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        ...mockActor,
        profile_path: null,
        birthday: null,
        place_of_birth: null,
      },
    });

    renderActorDetailPage();

    await screen.findByRole("heading", {
      name: mockActor.name,
    });

    expect(
      screen.queryByRole("img", {
        name: `${content.movieDetail.pictureOf} ${mockActor.name}`,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        `${content.movieDetail.birthDate}:`,
        { exact: false }
      )
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        `${content.movieDetail.birthPlace}:`,
        { exact: false }
      )
    ).not.toBeInTheDocument();
  });

  it("should display a fallback message when the biography is empty", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        ...mockActor,
        biography: "",
      },
    });

    renderActorDetailPage();

    expect(
      await screen.findByText(
        content.movieDetail.biographyNotAvailable
      )
    ).toBeInTheDocument();
  });

  it("should display the movies in which the actor has appeared", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage();

    const filmography = await screen.findByRole("region", {
      name: content.movieDetail.filmography,
    });

    for (const movie of mockActor.movie_credits.cast) {
      expect(
        within(filmography).getByRole("link", {
          name: new RegExp(movie.title, "i"),
        })
      ).toBeInTheDocument();
    }

    expect(
      within(filmography).queryByText(/Producer Movie/i)
    ).not.toBeInTheDocument();
  });

  it("should sort the filmography by release date", async () => {
    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage();

    const filmography = await screen.findByRole("region", {
      name: content.movieDetail.filmography,
    });

    const movies = within(filmography).getAllByRole("link");

    expect(movies[0]).toHaveTextContent("The Martian");
    expect(movies[1]).toHaveTextContent("Interstellar");
    expect(movies[2]).toHaveTextContent("The Bourne Identity");
  });

  it("should expand and collapse the actor filmography", async () => {
    const user = userEvent.setup();

    const movies = Array.from(
      { length: MAX_MOVIES_PER_PROFILE + 1 },
      (_, index) => ({
        id: index + 1,
        title: `Movie ${index + 1}`,
        character: "Actor",
        poster_path: null,
        release_date: "2020-01-01",
      })
    );

    mockGet.mockResolvedValueOnce({
      data: {
        ...mockActor,
        movie_credits: {
          ...mockActor.movie_credits,
          cast: movies,
        },
      },
    });

    renderActorDetailPage();

    const filmography = await screen.findByRole("region", {
      name: content.movieDetail.filmography,
    });

    expect(
      within(filmography).getAllByRole("link")
    ).toHaveLength(MAX_MOVIES_PER_PROFILE);

    const loadMoreButton = within(filmography).getByRole(
      "button",
      { name: content.loading.loadMore }
    );

    await user.click(loadMoreButton);

    expect(
      within(filmography).getAllByRole("link")
    ).toHaveLength(MAX_MOVIES_PER_PROFILE + 1);

    const loadLessButton = within(filmography).getByRole(
      "button",
      { name: content.loading.loadLess }
    );

    await user.click(loadLessButton);

    expect(
      within(filmography).getAllByRole("link")
    ).toHaveLength(MAX_MOVIES_PER_PROFILE);

    expect(
      within(filmography).getByRole("button", {
        name: content.loading.loadMore,
      })
    ).toBeInTheDocument();
  });

  it("should display a message when the filmography is empty", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        ...mockActor,
        movie_credits: {
          ...mockActor.movie_credits,
          cast: [],
        },
      },
    });

    renderActorDetailPage();

    expect(
      await screen.findByText(
        content.movieDetail.moviesNotAvailable
      )
    ).toBeInTheDocument();
  });

  it("should navigate to a movie selected from the filmography", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage();

    const movieLink = await screen.findByRole("link", {
      name: /Interstellar/i,
    });

    expect(movieLink).toHaveAttribute(
      "href",
      "/app/movie/157336"
    );

    await user.click(movieLink);

    expect(
      await screen.findByRole("heading", {
        name: "MovieDetailPage",
      })
    ).toBeInTheDocument();
  });

  it("should display an error when the actor request fails", async () => {
    mockGet.mockRejectedValueOnce(
      new Error("API request failed")
    );

    renderActorDetailPage();

    expect(
      await screen.findByRole("alert")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: mockActor.name,
      })
    ).not.toBeInTheDocument();
  });

  it("should display an error for an invalid actor ID", async () => {
    renderActorDetailPage("invalid");

    expect(
      await screen.findByText(
        content.movieDetail.actorNotFound
      )
    ).toBeInTheDocument();

    expect(mockGet).not.toHaveBeenCalled();
  });

  it("should navigate back to the original movie", async () => {
    const user = userEvent.setup();

    mockGet.mockResolvedValueOnce({
      data: mockActor,
    });

    renderActorDetailPage(String(mockActor.id), 157336);

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
      data: mockActor,
    });

    renderActorDetailPage();

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