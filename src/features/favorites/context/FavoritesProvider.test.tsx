import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, renderHook, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"
import { useContext } from "react"
import { FavoritesProvider } from "./FavoritesProvider"
import { FavoritesContext } from "./FavoritesContext"
import { useFavorites } from "../hooks/useFavorites"

vi.mock("../hooks/useFavorites", () => ({
  useFavorites: vi.fn(),
}))

const mockUseFavorites = vi.mocked(useFavorites)

const mockIsFavorite = vi.fn<ReturnType<typeof useFavorites>["isFavorite"]>()
const mockToggleFavorite = vi.fn<ReturnType<typeof useFavorites>["toggleFavorite"]>()

function mockFavorites(
  overrides: Partial<ReturnType<typeof useFavorites>> = {}
) {
  const value: ReturnType<typeof useFavorites> = {
    favorites: [],
    loading: false,
    error: "",
    updatingIds: [],
    isFavorite: mockIsFavorite,
    toggleFavorite: mockToggleFavorite,
    ...overrides,
  }

  mockUseFavorites.mockReturnValue(value)

  return value
}

function FavoritesConsumer() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error("FavoritesContext is unavailable")
  }

  return (
    <div>
      <p data-testid="favorites-count">
        {context.favorites.length}
      </p>

      <p data-testid="favorites-ids">
        {context.favorites.join(", ")}
      </p>

      <p data-testid="favorites-loading">
        {String(context.loading)}
      </p>

      <p data-testid="favorites-error">
        {context.error}
      </p>

      <p data-testid="is-favorite">
        {String(context.isFavorite(101))}
      </p>

      <button
        type="button"
        onClick={() => context.toggleFavorite(101)}
      >
        Toggle favorite
      </button>
    </div>
  )
}

function renderFavoritesProvider() {
  const user = userEvent.setup()

  const view = render(
    <FavoritesProvider>
      <FavoritesConsumer />
    </FavoritesProvider>
  )

  return { user, ...view }
}

beforeEach(() => {
  vi.resetAllMocks()

  mockIsFavorite.mockReturnValue(false)
  mockToggleFavorite.mockResolvedValue(true)

  mockFavorites()
})

afterEach(() => {
  cleanup()
})

describe("FavoritesProvider", () => {
  it("should render its children", () => {
    render(
      <FavoritesProvider>
        <h1>Child component</h1>
      </FavoritesProvider>
    )

    expect(
      screen.getByRole("heading", {
        name: "Child component",
      })
    ).toBeInTheDocument()
  })

  it("should call the useFavorites hook", () => {
    renderFavoritesProvider()

    expect(mockUseFavorites).toHaveBeenCalledTimes(1)
    expect(mockUseFavorites).toHaveBeenCalledWith()
  })

  it("should provide the value returned by useFavorites", () => {
    const value = mockFavorites({
      favorites: [101, 102],
    })

    const { result } = renderHook(
      () => useContext(FavoritesContext),
      {
        wrapper: FavoritesProvider,
      }
    )

    expect(result.current).toBe(value)
  })

  it("should provide an empty favorites array", () => {
    mockFavorites({
      favorites: [],
    })

    renderFavoritesProvider()

    expect(
      screen.getByTestId("favorites-count")
    ).toHaveTextContent("0")

    expect(
      screen.getByTestId("favorites-ids")
    ).toBeEmptyDOMElement()
  })

  it("should provide the favorite movie IDs", () => {
    mockFavorites({
      favorites: [101, 102, 103],
    })

    renderFavoritesProvider()

    expect(
      screen.getByTestId("favorites-count")
    ).toHaveTextContent("3")

    expect(
      screen.getByTestId("favorites-ids")
    ).toHaveTextContent("101, 102, 103")
  })

  it("should provide the loading state", () => {
    mockFavorites({
      loading: true,
    })

    renderFavoritesProvider()

    expect(
      screen.getByTestId("favorites-loading")
    ).toHaveTextContent("true")
  })

  it("should provide the error state", () => {
    mockFavorites({
      error: "Failed to load favorites",
    })

    renderFavoritesProvider()

    expect(
      screen.getByTestId("favorites-error")
    ).toHaveTextContent("Failed to load favorites")
  })

  it("should provide the isFavorite function", () => {
    mockIsFavorite.mockReturnValue(true)

    renderFavoritesProvider()

    expect(mockIsFavorite).toHaveBeenCalledWith(101)

    expect(
      screen.getByTestId("is-favorite")
    ).toHaveTextContent("true")
  })

  it("should allow children to call toggleFavorite", async () => {
    const { user } = renderFavoritesProvider()

    await user.click(
      screen.getByRole("button", {
        name: "Toggle favorite",
      })
    )

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1)
    expect(mockToggleFavorite).toHaveBeenCalledWith(101)
  })

  it("should update the context when the favorites value changes", () => {
    mockFavorites({
      favorites: [101],
    })

    const { rerender } = renderFavoritesProvider()

    expect(
      screen.getByTestId("favorites-count")
    ).toHaveTextContent("1")

    mockFavorites({
      favorites: [101, 102, 103],
    })

    rerender(
      <FavoritesProvider>
        <FavoritesConsumer />
      </FavoritesProvider>
    )

    expect(
      screen.getByTestId("favorites-count")
    ).toHaveTextContent("3")

    expect(
      screen.getByTestId("favorites-ids")
    ).toHaveTextContent("101, 102, 103")
  })

  it("should provide the same context to multiple consumers", () => {
    mockFavorites({
      favorites: [101, 102],
    })

    render(
      <FavoritesProvider>
        <FavoritesConsumer />
        <FavoritesConsumer />
      </FavoritesProvider>
    )

    const consumers = screen.getAllByTestId("favorites-count")

    expect(consumers).toHaveLength(2)

    consumers.forEach((consumer) => {
      expect(consumer).toHaveTextContent("2")
    })

    expect(mockUseFavorites).toHaveBeenCalledTimes(1)
  })
})