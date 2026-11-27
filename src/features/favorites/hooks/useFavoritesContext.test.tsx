import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook, cleanup } from "@testing-library/react"
import type { ReactNode } from "react"
import { useFavoritesContext } from "./useFavoritesContext"
import { FavoritesContext } from "../context/FavoritesContext"
import type { FavoritesContextType } from "../context/FavoritesContext"

function createMockContext(
  overrides: Partial<FavoritesContextType> = {}
): FavoritesContextType {
  return {
    favorites: [101, 102],
    loading: false,
    error: null,
    updatingIds: [],
    isFavorite: vi.fn<FavoritesContextType["isFavorite"]>().mockReturnValue(false),
    toggleFavorite: vi.fn<FavoritesContextType["toggleFavorite"]>().mockResolvedValue(true),
    ...overrides,
  }
}

function createWrapper(value: FavoritesContextType) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FavoritesContext.Provider value={value}>
        {children}
      </FavoritesContext.Provider>
    )
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("useFavoritesContext", () => {
  it("should return the context provided by FavoritesContext", () => {
    const value = createMockContext()

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    expect(result.current).toBe(value)
  })

  it("should throw an error when used outside FavoritesProvider", () => {
    expect(() => {
      renderHook(() => useFavoritesContext())
    }).toThrow(Error)
  })

  it("should throw the correct error message without a provider", () => {
    expect(() => {
      renderHook(() => useFavoritesContext())
    }).toThrow(
      "useFavoritesContext debe utilizarse dentro de FavoritesProvider"
    )
  })

  it("should provide access to favorite movie IDs", () => {
    const value = createMockContext({
      favorites: [101, 102, 103],
    })

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    expect(result.current.favorites).toEqual([101, 102, 103])
  })

  it("should provide access to the loading state", () => {
    const value = createMockContext({
      loading: true,
    })

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    expect(result.current.loading).toBe(true)
  })

  it("should provide access to the error state", () => {
    const value = createMockContext({
      error: "Failed to load favorites",
    })

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    expect(result.current.error).toBe(
      "Failed to load favorites"
    )
  })

  it("should provide access to updating movie IDs", () => {
    const value = createMockContext({
      updatingIds: [101, 103],
    })

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    expect(result.current.updatingIds).toEqual([101, 103])
  })

  it("should provide access to the isFavorite function", () => {
    const mockIsFavorite =
      vi.fn<FavoritesContextType["isFavorite"]>()
        .mockReturnValue(true)

    const value = createMockContext({
      isFavorite: mockIsFavorite,
    })

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    expect(result.current.isFavorite(101)).toBe(true)

    expect(mockIsFavorite).toHaveBeenCalledTimes(1)
    expect(mockIsFavorite).toHaveBeenCalledWith(101)
  })

  it("should provide access to the toggleFavorite function", async () => {
    const mockToggleFavorite =
      vi.fn<FavoritesContextType["toggleFavorite"]>()
        .mockResolvedValue(true)

    const value = createMockContext({
      toggleFavorite: mockToggleFavorite,
    })

    const { result } = renderHook(
      () => useFavoritesContext(),
      { wrapper: createWrapper(value) }
    )

    const success = await result.current.toggleFavorite(103)

    expect(success).toBe(true)
    expect(mockToggleFavorite).toHaveBeenCalledTimes(1)
    expect(mockToggleFavorite).toHaveBeenCalledWith(103)
  })

  it("should return updated values when the context changes", () => {
    let value = createMockContext({
      favorites: [101],
      loading: true,
    })

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <FavoritesContext.Provider value={value}>
          {children}
        </FavoritesContext.Provider>
      )
    }

    const { result, rerender } = renderHook(
      () => useFavoritesContext(),
      { wrapper: Wrapper }
    )

    expect(result.current.favorites).toEqual([101])
    expect(result.current.loading).toBe(true)

    value = createMockContext({
      favorites: [101, 102, 103],
      loading: false,
    })

    rerender()

    expect(result.current.favorites).toEqual([101, 102, 103])
    expect(result.current.loading).toBe(false)
  })
})