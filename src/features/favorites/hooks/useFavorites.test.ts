import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act, waitFor, cleanup } from "@testing-library/react"
import { useFavorites } from "./useFavorites"
import { getFavorites, addFavorite, removeFavorite } from "../services/favoritesService"
import content from "@/data/content.json"

vi.mock("../services/favoritesService", () => ({
  getFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}))

const mockGetFavorites = vi.mocked(getFavorites)
const mockAddFavorite = vi.mocked(addFavorite)
const mockRemoveFavorite = vi.mocked(removeFavorite)

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

async function renderLoadedFavorites() {
  const view = renderHook(() => useFavorites())

  await waitFor(() => {
    expect(view.result.current.loading).toBe(false)
  })

  return view
}

beforeEach(() => {
  vi.resetAllMocks()

  mockGetFavorites.mockResolvedValue([
    { movie_id: 101 },
    { movie_id: 102 },
  ])

  mockAddFavorite.mockResolvedValue(undefined)
  mockRemoveFavorite.mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
})

describe("useFavorites", () => {
  it("should initialize with an empty favorites array", async () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should initialize with loading set to true", async () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should initialize with no error", async () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should initialize with no updating IDs", async () => {
    const { result } = await renderLoadedFavorites()

    expect(result.current.updatingIds).toEqual([])
  })

  it("should call getFavorites when mounted", async () => {
    await renderLoadedFavorites()

    expect(mockGetFavorites).toHaveBeenCalledTimes(1)
    expect(mockGetFavorites).toHaveBeenCalledWith()
  })

  it("should transform favorite objects into movie IDs", async () => {
    const { result } = await renderLoadedFavorites()

    expect(result.current.favorites).toEqual([101, 102])
  })

  it("should stop loading after a successful request", async () => {
    const { result } = await renderLoadedFavorites()

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("should handle an empty favorites response", async () => {
    mockGetFavorites.mockResolvedValue([])

    const { result } = await renderLoadedFavorites()

    expect(result.current.favorites).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it("should set an error when loading favorites fails", async () => {
    mockGetFavorites.mockRejectedValue(
      new Error("Failed to load favorites")
    )

    const { result } = await renderLoadedFavorites()

    expect(result.current.error).toBe(
      content.favorites.loadError
    )
  })

  it("should stop loading when the request fails", async () => {
    mockGetFavorites.mockRejectedValue(
      new Error("Failed to load favorites")
    )

    const { result } = await renderLoadedFavorites()

    expect(result.current.loading).toBe(false)
    expect(result.current.favorites).toEqual([])
  })

  it("should return true when a movie is a favorite", async () => {
    const { result } = await renderLoadedFavorites()

    expect(result.current.isFavorite(101)).toBe(true)
  })

  it("should return false when a movie is not a favorite", async () => {
    const { result } = await renderLoadedFavorites()

    expect(result.current.isFavorite(999)).toBe(false)
  })

  it("should add a movie to favorites", async () => {
    const { result } = await renderLoadedFavorites()

    await act(async () => {
      await result.current.toggleFavorite(103)
    })

    expect(mockAddFavorite).toHaveBeenCalledTimes(1)
    expect(mockAddFavorite).toHaveBeenCalledWith(103)
    expect(mockRemoveFavorite).not.toHaveBeenCalled()
    expect(result.current.favorites).toEqual([101, 102, 103])
    expect(result.current.isFavorite(103)).toBe(true)
  })

  it("should remove a movie from favorites", async () => {
    const { result } = await renderLoadedFavorites()

    await act(async () => {
      await result.current.toggleFavorite(101)
    })

    expect(mockRemoveFavorite).toHaveBeenCalledTimes(1)
    expect(mockRemoveFavorite).toHaveBeenCalledWith(101)
    expect(mockAddFavorite).not.toHaveBeenCalled()
    expect(result.current.favorites).toEqual([102])
    expect(result.current.isFavorite(101)).toBe(false)
  })

  it("should return true when adding a favorite succeeds", async () => {
    const { result } = await renderLoadedFavorites()

    await act(async () => {
      const success = await result.current.toggleFavorite(103)

      expect(success).toBe(true)
    })
  })

  it("should return true when removing a favorite succeeds", async () => {
    const { result } = await renderLoadedFavorites()

    await act(async () => {
      const success = await result.current.toggleFavorite(101)

      expect(success).toBe(true)
    })
  })

  it("should handle an error when adding a favorite", async () => {
    mockAddFavorite.mockRejectedValue(
      new Error("Failed to add favorite")
    )

    const { result } = await renderLoadedFavorites()

    await act(async () => {
      const success = await result.current.toggleFavorite(103)

      expect(success).toBe(false)
    })

    expect(result.current.error).toBe(
      content.favorites.addError
    )

    expect(result.current.favorites).toEqual([101, 102])
    expect(result.current.isFavorite(103)).toBe(false)
  })

  it("should handle an error when removing a favorite", async () => {
    mockRemoveFavorite.mockRejectedValue(
      new Error("Failed to remove favorite")
    )

    const { result } = await renderLoadedFavorites()

    await act(async () => {
      const success = await result.current.toggleFavorite(101)

      expect(success).toBe(false)
    })

    expect(result.current.error).toBe(
      content.favorites.removeError
    )

    expect(result.current.favorites).toEqual([101, 102])
    expect(result.current.isFavorite(101)).toBe(true)
  })

  it("should track a movie ID while adding a favorite", async () => {
    const deferred = createDeferred<void>()

    mockAddFavorite.mockReturnValue(deferred.promise)

    const { result } = await renderLoadedFavorites()

    let operation!: Promise<boolean>

    act(() => {
      operation = result.current.toggleFavorite(103)
    })

    expect(result.current.updatingIds).toContain(103)

    await act(async () => {
      deferred.resolve(undefined)
      await operation
    })

    expect(result.current.updatingIds).not.toContain(103)
    expect(result.current.favorites).toContain(103)
  })

  it("should track a movie ID while removing a favorite", async () => {
    const deferred = createDeferred<void>()

    mockRemoveFavorite.mockReturnValue(deferred.promise)

    const { result } = await renderLoadedFavorites()

    let operation!: Promise<boolean>

    act(() => {
      operation = result.current.toggleFavorite(101)
    })

    expect(result.current.updatingIds).toContain(101)

    await act(async () => {
      deferred.resolve(undefined)
      await operation
    })

    expect(result.current.updatingIds).not.toContain(101)
    expect(result.current.favorites).not.toContain(101)
  })

  it("should clear updating IDs when adding fails", async () => {
    mockAddFavorite.mockRejectedValue(
      new Error("Failed to add favorite")
    )

    const { result } = await renderLoadedFavorites()

    await act(async () => {
      await result.current.toggleFavorite(103)
    })

    expect(result.current.updatingIds).toEqual([])
  })

  it("should clear updating IDs when removing fails", async () => {
    mockRemoveFavorite.mockRejectedValue(
      new Error("Failed to remove favorite")
    )

    const { result } = await renderLoadedFavorites()

    await act(async () => {
      await result.current.toggleFavorite(101)
    })

    expect(result.current.updatingIds).toEqual([])
  })

  it("should prevent toggling favorites during initial loading", async () => {
    const deferred = createDeferred<
      Awaited<ReturnType<typeof getFavorites>>
    >()

    mockGetFavorites.mockReturnValue(deferred.promise)

    const { result } = renderHook(() => useFavorites())

    expect(result.current.loading).toBe(true)

    await act(async () => {
      const success = await result.current.toggleFavorite(103)

      expect(success).toBe(false)
    })

    expect(mockAddFavorite).not.toHaveBeenCalled()
    expect(mockRemoveFavorite).not.toHaveBeenCalled()
    expect(result.current.updatingIds).toEqual([])

    await act(async () => {
      deferred.resolve([])
    })

    expect(result.current.loading).toBe(false)
  })

  it("should prevent duplicate operations for the same movie", async () => {
    const deferred = createDeferred<void>()

    mockAddFavorite.mockReturnValue(deferred.promise)

    const { result } = await renderLoadedFavorites()

    let firstOperation!: Promise<boolean>

    act(() => {
      firstOperation = result.current.toggleFavorite(103)
    })

    expect(result.current.updatingIds).toContain(103)

    await act(async () => {
      const secondOperation =
        await result.current.toggleFavorite(103)

      expect(secondOperation).toBe(false)
    })

    expect(mockAddFavorite).toHaveBeenCalledTimes(1)

    await act(async () => {
      deferred.resolve(undefined)

      expect(await firstOperation).toBe(true)
    })

    expect(result.current.favorites).toEqual([101, 102, 103])
    expect(result.current.updatingIds).toEqual([])
  })

  it("should allow simultaneous operations for different movies", async () => {
    const firstDeferred = createDeferred<void>()
    const secondDeferred = createDeferred<void>()

    mockAddFavorite
      .mockReturnValueOnce(firstDeferred.promise)
      .mockReturnValueOnce(secondDeferred.promise)

    const { result } = await renderLoadedFavorites()

    let firstOperation!: Promise<boolean>
    let secondOperation!: Promise<boolean>

    act(() => {
      firstOperation = result.current.toggleFavorite(103)
    })

    act(() => {
      secondOperation = result.current.toggleFavorite(104)
    })

    expect(result.current.updatingIds).toEqual([103, 104])

    await act(async () => {
      firstDeferred.resolve(undefined)
      await firstOperation
    })

    expect(result.current.updatingIds).toEqual([104])
    expect(result.current.favorites).toContain(103)

    await act(async () => {
      secondDeferred.resolve(undefined)
      await secondOperation
    })

    expect(result.current.favorites).toEqual([101, 102, 103, 104])
    expect(result.current.updatingIds).toEqual([])
  })

  it("should clear previous errors when starting a new operation", async () => {
    mockAddFavorite.mockRejectedValueOnce(
      new Error("Failed to add favorite")
    )

    const { result } = await renderLoadedFavorites()

    await act(async () => {
      await result.current.toggleFavorite(103)
    })

    expect(result.current.error).toBe(
      content.favorites.addError
    )

    const deferred = createDeferred<void>()

    mockAddFavorite.mockReturnValueOnce(deferred.promise)

    let operation!: Promise<boolean>

    act(() => {
      operation = result.current.toggleFavorite(103)
    })

    expect(result.current.error).toBeNull()

    await act(async () => {
      deferred.resolve(undefined)
      await operation
    })

    expect(result.current.error).toBeNull()
    expect(result.current.favorites).toContain(103)
  })

  it("should allow a movie to be added and removed again", async () => {
    const { result } = await renderLoadedFavorites()

    await act(async () => {
      await result.current.toggleFavorite(103)
    })

    expect(result.current.isFavorite(103)).toBe(true)

    await act(async () => {
      await result.current.toggleFavorite(103)
    })

    expect(result.current.isFavorite(103)).toBe(false)
    expect(result.current.favorites).toEqual([101, 102])
    expect(mockAddFavorite).toHaveBeenCalledWith(103)
    expect(mockRemoveFavorite).toHaveBeenCalledWith(103)
  })

  it("should not reload favorites on rerender", async () => {
    const { rerender } = await renderLoadedFavorites()

    rerender()
    rerender()

    expect(mockGetFavorites).toHaveBeenCalledTimes(1)
  })

  it("should handle a successful request after unmounting", async () => {
    const deferred = createDeferred<
      Awaited<ReturnType<typeof getFavorites>>
    >()

    mockGetFavorites.mockReturnValue(deferred.promise)

    const { result, unmount } = renderHook(() => useFavorites())

    expect(result.current.loading).toBe(true)

    unmount()

    await act(async () => {
      deferred.resolve([{ movie_id: 103 }])
    })

    expect(result.current.favorites).toEqual([])
    expect(result.current.loading).toBe(true)
  })

  it("should handle a failed request after unmounting", async () => {
    const deferred = createDeferred<
      Awaited<ReturnType<typeof getFavorites>>
    >()

    mockGetFavorites.mockReturnValue(deferred.promise)

    const { result, unmount } = renderHook(() => useFavorites())

    unmount()

    await act(async () => {
      deferred.reject(new Error("Failed to load favorites"))
    })

    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(true)
  })
})