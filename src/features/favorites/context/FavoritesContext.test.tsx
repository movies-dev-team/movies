import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook, cleanup } from "@testing-library/react"
import { useContext } from "react"
import type { ReactNode } from "react"
import { FavoritesContext } from "./FavoritesContext"
import type { FavoritesContextType } from "./FavoritesContext"

function createMockContext(
  overrides: Partial<FavoritesContextType> = {}
): FavoritesContextType {
  return {
    favorites: [],
    loading: false,
    error: "",
    updatingIds: [],
    isFavorite: vi.fn<FavoritesContextType["isFavorite"]>().mockReturnValue(false),
    toggleFavorite: vi.fn<FavoritesContextType["toggleFavorite"]>().mockResolvedValue(true),
    ...overrides,
  }
}

afterEach(() => {
  cleanup()
})

describe("FavoritesContext", () => {
  it("should return null when used without a provider", () => {
    const { result } = renderHook(() =>
      useContext(FavoritesContext)
    )

    expect(result.current).toBeNull()
  })

  it("should provide the context value to consumers", () => {
    const value = createMockContext({
      favorites: [101, 102],
    })

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <FavoritesContext.Provider value={value}>
          {children}
        </FavoritesContext.Provider>
      )
    }

    const { result } = renderHook(
      () => useContext(FavoritesContext),
      { wrapper: Wrapper }
    )

    expect(result.current).toBe(value)
  })

  it("should update the context when the provided value changes", () => {
    let value = createMockContext({
      favorites: [101],
    })

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <FavoritesContext.Provider value={value}>
          {children}
        </FavoritesContext.Provider>
      )
    }

    const { result, rerender } = renderHook(
      () => useContext(FavoritesContext),
      { wrapper: Wrapper }
    )

    expect(result.current?.favorites).toEqual([101])

    value = createMockContext({
      favorites: [101, 102, 103],
    })

    rerender()

    expect(result.current?.favorites).toEqual([101, 102, 103])
  })

  it("should keep context values independent between providers", () => {
    const firstValue = createMockContext({
      favorites: [101],
    })

    const secondValue = createMockContext({
      favorites: [201, 202],
    })

    function FirstWrapper({ children }: { children: ReactNode }) {
      return (
        <FavoritesContext.Provider value={firstValue}>
          {children}
        </FavoritesContext.Provider>
      )
    }

    function SecondWrapper({ children }: { children: ReactNode }) {
      return (
        <FavoritesContext.Provider value={secondValue}>
          {children}
        </FavoritesContext.Provider>
      )
    }

    const first = renderHook(
      () => useContext(FavoritesContext),
      { wrapper: FirstWrapper }
    )

    const second = renderHook(
      () => useContext(FavoritesContext),
      { wrapper: SecondWrapper }
    )

    expect(first.result.current).toBe(firstValue)
    expect(second.result.current).toBe(secondValue)

    expect(first.result.current?.favorites).toEqual([101])
    expect(second.result.current?.favorites).toEqual([201, 202])
  })
})