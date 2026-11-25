import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, act, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import type { Movie } from "@/features/catalog/types/movieService"
import type { FavoritesContextType } from "./context/FavoritesContext"
import FavoritesPage from "./FavoritesPage"
import { useFavoritesContext } from "./hooks/useFavoritesContext"
import { getMovieById } from "@/features/catalog/services/movieService"
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage"
import content from "@/data/content.json"

vi.mock("./hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}))

vi.mock("@/features/catalog/services/movieService", () => ({
  getMovieById: vi.fn(),
}))

vi.mock("@/shared/utils/getApiErrorMessage", () => ({
  getApiErrorMessage: vi.fn(),
}))

vi.mock("@/shared/components/MovieCard", () => ({
  default: ({ movie }: { movie: Movie }) => (
    <article data-testid="movie-card">
      <h2>{movie.title}</h2>
    </article>
  ),
}))

vi.mock("@/shared/components/ErrorMessage", () => ({
  default: ({ message }: { message: string }) => (
    <p role="alert">{message}</p>
  ),
}))

const mockUseFavoritesContext = vi.mocked(useFavoritesContext)
const mockGetMovieById = vi.mocked(getMovieById)
const mockGetApiErrorMessage = vi.mocked(getApiErrorMessage)

function createMovie(id: number, title: string): Movie {
  return {
    id,
    title,
    overview: `Overview of ${title}`,
    poster_path: `/poster-${id}.jpg`,
    backdrop_path: `/backdrop-${id}.jpg`,
    release_date: "2026-01-01",
    vote_average: 8,
    vote_count: 100,
    popularity: 100,
    adult: false,
    original_language: "en",
    original_title: title,
    genre_ids: [28],
    video: false,
  } as Movie
}

const movieOne = createMovie(101, "Interstellar")
const movieTwo = createMovie(102, "Inception")
const movieThree = createMovie(103, "The Dark Knight")

function mockFavorites(
  overrides: Partial<FavoritesContextType> = {}
) {
  mockUseFavoritesContext.mockReturnValue({
    favorites: [101, 102],
    loading: false,
    error: null,
    updatingIds: [],
    isFavorite: vi.fn<FavoritesContextType["isFavorite"]>(),
    toggleFavorite: vi.fn<FavoritesContextType["toggleFavorite"]>()
      .mockResolvedValue(true),
    ...overrides,
  })
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

beforeEach(() => {
  vi.resetAllMocks()

  mockFavorites()

  mockGetMovieById.mockImplementation(async (movieId) => {
    switch (movieId) {
      case 101:
        return movieOne
      case 102:
        return movieTwo
      case 103:
        return movieThree
      default:
        throw new Error("Movie not found")
    }
  })

  mockGetApiErrorMessage.mockReturnValue(
    content.errors.generic
  )
})

afterEach(() => {
  cleanup()
})

describe("FavoritesPage", () => {
  it("should render the favorites page title", async () => {
    render(<FavoritesPage />)

    expect(
      screen.getByRole("heading", {
        name: content.favorites.pageTitle,
        level: 1,
      })
    ).toBeInTheDocument()

    await screen.findByText(movieOne.title)
  })

  it("should render the favorites banner", async () => {
    render(<FavoritesPage />)

    expect(
      screen.getByRole("img", {
        name: content.favorites.bannerAlt,
      })
    ).toBeInTheDocument()

    await screen.findByText(movieOne.title)
  })

  it("should display a loading message while the favorites context is loading", () => {
    mockFavorites({
      loading: true,
    })

    render(<FavoritesPage />)

    expect(
      screen.getByText(content.favorites.loading)
    ).toBeInTheDocument()
  })

  it("should not fetch movies while the favorites context is loading", () => {
    mockFavorites({
      loading: true,
    })

    render(<FavoritesPage />)

    expect(mockGetMovieById).not.toHaveBeenCalled()
  })

  it("should display a loading message while fetching movies", async () => {
    const deferred = createDeferred<Movie>()

    mockFavorites({
      favorites: [101],
    })

    mockGetMovieById.mockReturnValue(deferred.promise)

    render(<FavoritesPage />)

    expect(
      screen.getByText(content.favorites.loading)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId("movie-card")
    ).not.toBeInTheDocument()

    await act(async () => {
      deferred.resolve(movieOne)
    })

    expect(
      screen.getByText(movieOne.title)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(content.favorites.loading)
    ).not.toBeInTheDocument()
  })

  it("should display an empty message when there are no favorites", async () => {
    mockFavorites({
      favorites: [],
    })

    render(<FavoritesPage />)

    expect(
      await screen.findByText(content.favorites.empty)
    ).toBeInTheDocument()
  })

  it("should not fetch movies when the favorites array is empty", async () => {
    mockFavorites({
      favorites: [],
    })

    render(<FavoritesPage />)

    await screen.findByText(content.favorites.empty)

    expect(mockGetMovieById).not.toHaveBeenCalled()
  })

  it("should fetch each favorite movie by its ID", async () => {
    render(<FavoritesPage />)

    await screen.findByText(movieOne.title)

    expect(mockGetMovieById).toHaveBeenCalledTimes(2)
    expect(mockGetMovieById).toHaveBeenCalledWith(101)
    expect(mockGetMovieById).toHaveBeenCalledWith(102)
  })

  it("should render the fetched favorite movies", async () => {
    render(<FavoritesPage />)

    expect(
      await screen.findByText(movieOne.title)
    ).toBeInTheDocument()

    expect(
      await screen.findByText(movieTwo.title)
    ).toBeInTheDocument()
  })

  it("should render the correct number of movie cards", async () => {
    render(<FavoritesPage />)

    const cards = await screen.findAllByTestId("movie-card")

    expect(cards).toHaveLength(2)

    expect(
      screen.getAllByRole("listitem")
    ).toHaveLength(2)
  })

  it("should display an error from the favorites context", async () => {
    mockFavorites({
      favorites: [],
      error: content.favorites.loadError,
    })

    render(<FavoritesPage />)

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(content.favorites.loadError)

    expect(
      screen.queryByText(content.favorites.empty)
    ).not.toBeInTheDocument()
  })

  it("should display an error when fetching movie details fails", async () => {
    mockGetMovieById.mockRejectedValue(
      new Error("Failed to fetch movie")
    )

    render(<FavoritesPage />)

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(content.errors.generic)

    expect(
      screen.queryByTestId("movie-card")
    ).not.toBeInTheDocument()
  })

  it("should transform API errors using getApiErrorMessage", async () => {
    const error = new Error("Network error")

    mockFavorites({
      favorites: [101],
    })

    mockGetMovieById.mockRejectedValue(error)

    mockGetApiErrorMessage.mockReturnValue(
      content.errors.network
    )

    render(<FavoritesPage />)

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(content.errors.network)

    expect(mockGetApiErrorMessage).toHaveBeenCalledTimes(1)
    expect(mockGetApiErrorMessage).toHaveBeenCalledWith(error)
  })

  it("should prioritize the loading state over errors", () => {
    mockFavorites({
      loading: true,
      error: content.favorites.loadError,
    })

    render(<FavoritesPage />)

    expect(
      screen.getByText(content.favorites.loading)
    ).toBeInTheDocument()

    expect(
      screen.queryByRole("alert")
    ).not.toBeInTheDocument()
  })

  it("should prioritize the favorites context error over the API error", async () => {
    mockFavorites({
      error: content.favorites.loadError,
    })

    mockGetMovieById.mockRejectedValue(
      new Error("API error")
    )

    mockGetApiErrorMessage.mockReturnValue(
      content.errors.network
    )

    render(<FavoritesPage />)

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(content.favorites.loadError)

    expect(
      screen.queryByText(content.errors.network)
    ).not.toBeInTheDocument()
  })

  it("should fetch movies when the favorites array changes", async () => {
    const { rerender } = render(<FavoritesPage />)

    await screen.findByText(movieOne.title)

    mockGetMovieById.mockClear()

    mockFavorites({
      favorites: [101, 102, 103],
    })

    rerender(<FavoritesPage />)

    expect(
      await screen.findByText(movieThree.title)
    ).toBeInTheDocument()

    expect(mockGetMovieById).toHaveBeenCalledTimes(3)
    expect(mockGetMovieById).toHaveBeenCalledWith(101)
    expect(mockGetMovieById).toHaveBeenCalledWith(102)
    expect(mockGetMovieById).toHaveBeenCalledWith(103)

    expect(
      screen.getAllByTestId("movie-card")
    ).toHaveLength(3)
  })

  it("should remove a movie from the rendered list when favorites change", async () => {
    const { rerender } = render(<FavoritesPage />)

    await screen.findByText(movieTwo.title)

    mockFavorites({
      favorites: [101],
    })

    rerender(<FavoritesPage />)

    await waitFor(() => {
      expect(
        screen.queryByText(movieTwo.title)
      ).not.toBeInTheDocument()

      expect(
        screen.getByText(movieOne.title)
      ).toBeInTheDocument()

      expect(
        screen.getAllByTestId("movie-card")
      ).toHaveLength(1)
    })
  })

  it("should display the empty message when all favorites are removed", async () => {
    const { rerender } = render(<FavoritesPage />)

    await screen.findByText(movieOne.title)

    mockGetMovieById.mockClear()

    mockFavorites({
      favorites: [],
    })

    rerender(<FavoritesPage />)

    expect(
      await screen.findByText(content.favorites.empty)
    ).toBeInTheDocument()

    expect(
      screen.queryAllByTestId("movie-card")
    ).toHaveLength(0)

    expect(mockGetMovieById).not.toHaveBeenCalled()
  })

  it("should ignore outdated movie requests when favorites change", async () => {
    const firstRequest = createDeferred<Movie>()
    const secondRequest = createDeferred<Movie>()

    mockFavorites({
      favorites: [101],
    })

    mockGetMovieById
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise)

    const { rerender } = render(<FavoritesPage />)

    mockFavorites({
      favorites: [102],
    })

    rerender(<FavoritesPage />)

    await act(async () => {
      secondRequest.resolve(movieTwo)
    })

    expect(
      screen.getByText(movieTwo.title)
    ).toBeInTheDocument()

    await act(async () => {
      firstRequest.resolve(movieOne)
    })

    expect(
      screen.getByText(movieTwo.title)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(movieOne.title)
    ).not.toBeInTheDocument()

    expect(
      screen.getAllByTestId("movie-card")
    ).toHaveLength(1)
  })

  it("should clear previous API errors when a new request succeeds", async () => {
    mockFavorites({
      favorites: [101],
    })

    mockGetMovieById.mockRejectedValueOnce(
      new Error("API error")
    )

    const { rerender } = render(<FavoritesPage />)

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(content.errors.generic)

    mockFavorites({
      favorites: [102],
    })

    rerender(<FavoritesPage />)

    expect(
      await screen.findByText(movieTwo.title)
    ).toBeInTheDocument()

    expect(
      screen.queryByRole("alert")
    ).not.toBeInTheDocument()
  })
})