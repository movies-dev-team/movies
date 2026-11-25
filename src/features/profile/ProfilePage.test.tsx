import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter, Routes, Route } from "react-router"
import ProfilePage from "./ProfilePage"
import { useProfile } from "./hooks/useProfile"
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext"
import content from "@/data/content.json"

vi.mock("./hooks/useProfile", () => ({
  useProfile: vi.fn(),
}))

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}))

const mockUseProfile = vi.mocked(useProfile)
const mockUseFavoritesContext = vi.mocked(useFavoritesContext)

const mockProfile = {
  username: "testuser",
  email: "usuario@gmail.com",
}

function mockFavorites(
  overrides: Partial<ReturnType<typeof useFavoritesContext>> = {}
) {
  mockUseFavoritesContext.mockReturnValue({
    favorites: [],
    loading: false,
    error: "",
    updatingIds: [],
    isFavorite: vi.fn(),
    toggleFavorite: vi.fn(),
    ...overrides,
  })
}

function renderProfilePage() {
  const user = userEvent.setup()

  const view = render(
    <MemoryRouter initialEntries={["/app/profile"]}>
      <Routes>
        <Route
          path="/app/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/app/favorites"
          element={<h1>FavoritesPage</h1>}
        />
      </Routes>
    </MemoryRouter>
  )

  return { user, ...view }
}

beforeEach(() => {
  vi.resetAllMocks()

  mockUseProfile.mockReturnValue({
    profile: mockProfile,
    loading: false,
    error: "",
  })

  mockFavorites()
})

afterEach(() => {
  cleanup()
})

describe("ProfilePage", () => {
  it("should render the profile page title", () => {
    renderProfilePage()

    expect(
      screen.getByRole("heading", {
        name: content.navigation.profile.information,
        level: 1,
      })
    ).toBeInTheDocument()
  })

  it("should display a loading message while the profile is loading", () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: true,
      error: "",
    })

    renderProfilePage()

    expect(
      screen.getByText(content.profile.loading)
    ).toBeInTheDocument()
  })

  it("should display an error when the profile request fails", () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      error: content.profile.loadError,
    })

    renderProfilePage()

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.profile.loadError
    )
  })

  it("should display the username", () => {
    renderProfilePage()

    expect(
      screen.getByRole("heading", {
        name: mockProfile.username,
        level: 2,
      })
    ).toBeInTheDocument()
  })

  it("should display the user email", () => {
    renderProfilePage()

    expect(
      screen.getByText(mockProfile.email)
    ).toBeInTheDocument()
  })

  it("should display fallback messages when the profile is unavailable", () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      error: "",
    })

    renderProfilePage()

    expect(
      screen.getByText(content.profile.usernameUnavailable)
    ).toBeInTheDocument()

    expect(
      screen.getByText(content.profile.emailUnavailable)
    ).toBeInTheDocument()
  })

  it("should display a fallback message when the email is unavailable", () => {
    mockUseProfile.mockReturnValue({
      profile: {
        username: "testuser",
        email: undefined,
      },
      loading: false,
      error: "",
    })

    renderProfilePage()

    expect(
      screen.getByText("testuser")
    ).toBeInTheDocument()

    expect(
      screen.getByText(content.profile.emailUnavailable)
    ).toBeInTheDocument()
  })

  it("should display a loading message while favorites are loading", () => {
    mockFavorites({
      loading: true,
    })

    renderProfilePage()

    expect(
      screen.getByText(content.favorites.loading)
    ).toBeInTheDocument()

    expect(
      screen.queryByText("0")
    ).not.toBeInTheDocument()
  })

  it("should display an error when favorites cannot be loaded", () => {
    mockFavorites({
      error: content.favorites.loadError,
    })

    renderProfilePage()

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.favorites.loadError
    )

    expect(
      screen.queryByText("0")
    ).not.toBeInTheDocument()
  })

  it("should display zero when the user has no favorites", () => {
    mockFavorites({
      favorites: [],
    })

    renderProfilePage()

    expect(
      screen.getByText("0")
    ).toBeInTheDocument()
  })

  it("should display the correct number of favorite movies", () => {
    mockFavorites({
      favorites: [101, 102, 103],
    })

    renderProfilePage()

    expect(
      screen.getByText("3")
    ).toBeInTheDocument()
  })

  it("should render a link to the favorites page", () => {
    renderProfilePage()

    const favoritesLink = screen.getByRole("link", {
      name: content.profile.favoritesCount,
    })

    expect(favoritesLink).toBeInTheDocument()

    expect(favoritesLink).toHaveAttribute(
      "href",
      "/app/favorites"
    )
  })

  it("should navigate to the favorites page when the link is clicked", async () => {
    const { user } = renderProfilePage()

    await user.click(
      screen.getByRole("link", {
        name: content.profile.favoritesCount,
      })
    )

    expect(
      await screen.findByRole("heading", {
        name: "FavoritesPage",
      })
    ).toBeInTheDocument()
  })

  it("should not display profile information while loading", () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: true,
      error: "",
    })

    renderProfilePage()

    expect(
      screen.queryByText(mockProfile.username)
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(mockProfile.email)
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole("link", {
        name: content.profile.favoritesCount,
      })
    ).not.toBeInTheDocument()
  })

  it("should not display profile information when an error occurs", () => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: content.profile.loadError,
    })

    renderProfilePage()

    expect(
      screen.queryByText(mockProfile.username)
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(mockProfile.email)
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole("link", {
        name: content.profile.favoritesCount,
      })
    ).not.toBeInTheDocument()
  })

  it("should update the favorites count when favorites change", () => {
    mockFavorites({
      favorites: [101, 102],
    })

    const { rerender } = renderProfilePage()

    expect(
      screen.getByText("2")
    ).toBeInTheDocument()

    mockFavorites({
      favorites: [101, 102, 103],
    })

    rerender(
      <MemoryRouter initialEntries={["/app/profile"]}>
        <Routes>
          <Route
            path="/app/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/app/favorites"
            element={<h1>FavoritesPage</h1>}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText("3")
    ).toBeInTheDocument()

    expect(
      screen.queryByText("2")
    ).not.toBeInTheDocument()
  })
})