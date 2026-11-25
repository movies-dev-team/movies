import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthApiError, PostgrestError } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"
import { getFavorites, addFavorite, removeFavorite } from "./favoritesService"

const {
  mockGetUser,
  mockFrom,
  mockSelect,
  mockEq,
  mockInsert,
  mockSingle,
  mockDelete,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockSelect: vi.fn(),
  mockEq: vi.fn(),
  mockInsert: vi.fn(),
  mockSingle: vi.fn(),
  mockDelete: vi.fn(),
}))

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  },
}))

const mockUser: User = {
  id: "test-user-id",
  aud: "authenticated",
  email: "usuario@gmail.com",
  role: "authenticated",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-01-01T00:00:00Z",
}

const mockFavorites = [
  {
    user_id: mockUser.id,
    movie_id: 101,
  },
  {
    user_id: mockUser.id,
    movie_id: 102,
  },
]

const mockNewFavorite = {
  user_id: mockUser.id,
  movie_id: 103,
}

function createAuthError() {
  return new AuthApiError(
    "Authentication failed",
    401,
    "bad_jwt"
  )
}

function createDatabaseError(message: string, code: string) {
  return new PostgrestError({
    message,
    details: "",
    hint: "",
    code,
  })
}

function mockAuthenticationError() {
  const error = createAuthError()

  mockGetUser.mockResolvedValue({
    data: {
      user: null,
    },
    error,
  })

  return error
}

function mockUnauthenticatedUser() {
  mockGetUser.mockResolvedValue({
    data: {
      user: null,
    },
    error: null,
  })
}

beforeEach(() => {
  vi.resetAllMocks()

  mockGetUser.mockResolvedValue({
    data: {
      user: mockUser,
    },
    error: null,
  })

  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
  })
})

describe("getFavorites", () => {
  beforeEach(() => {
    mockSelect.mockReturnValue({
      eq: mockEq,
    })

    mockEq.mockResolvedValue({
      data: mockFavorites,
      error: null,
    })
  })

  it("should get the authenticated user", async () => {
    await getFavorites()

    expect(mockGetUser).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledWith()
  })

  it("should query the favorites table", async () => {
    await getFavorites()

    expect(mockFrom).toHaveBeenCalledTimes(1)
    expect(mockFrom).toHaveBeenCalledWith("favorites")
  })

  it("should select all columns", async () => {
    await getFavorites()

    expect(mockSelect).toHaveBeenCalledTimes(1)
    expect(mockSelect).toHaveBeenCalledWith("*")
  })

  it("should filter favorites by the authenticated user ID", async () => {
    await getFavorites()

    expect(mockEq).toHaveBeenCalledTimes(1)
    expect(mockEq).toHaveBeenCalledWith(
      "user_id",
      mockUser.id
    )
  })

  it("should return the user favorites", async () => {
    const result = await getFavorites()

    expect(result).toEqual(mockFavorites)
  })

  it("should return an empty array when the user has no favorites", async () => {
    mockEq.mockResolvedValue({
      data: [],
      error: null,
    })

    const result = await getFavorites()

    expect(result).toEqual([])
  })

  it("should throw an error when authentication fails", async () => {
    const error = mockAuthenticationError()

    await expect(getFavorites()).rejects.toBe(error)

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockSelect).not.toHaveBeenCalled()
    expect(mockEq).not.toHaveBeenCalled()
  })

  it("should throw an error when the user is not authenticated", async () => {
    mockUnauthenticatedUser()

    await expect(getFavorites()).rejects.toThrow(
      "Usuario no autenticado"
    )

    expect(mockFrom).not.toHaveBeenCalled()
  })

  it("should throw an error when the database query fails", async () => {
    const error = createDatabaseError(
      "Failed to load favorites",
      "42501"
    )

    mockEq.mockResolvedValue({
      data: null,
      error,
    })

    await expect(getFavorites()).rejects.toBe(error)
  })
})

describe("addFavorite", () => {
  beforeEach(() => {
    mockInsert.mockReturnValue({
      select: mockSelect,
    })

    mockSelect.mockReturnValue({
      single: mockSingle,
    })

    mockSingle.mockResolvedValue({
      data: mockNewFavorite,
      error: null,
    })
  })

  it("should get the authenticated user", async () => {
    await addFavorite(103)

    expect(mockGetUser).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledWith()
  })

  it("should access the favorites table", async () => {
    await addFavorite(103)

    expect(mockFrom).toHaveBeenCalledTimes(1)
    expect(mockFrom).toHaveBeenCalledWith("favorites")
  })

  it("should insert the user ID and movie ID", async () => {
    await addFavorite(103)

    expect(mockInsert).toHaveBeenCalledTimes(1)

    expect(mockInsert).toHaveBeenCalledWith({
      user_id: mockUser.id,
      movie_id: 103,
    })
  })

  it("should select the inserted favorite", async () => {
    await addFavorite(103)

    expect(mockSelect).toHaveBeenCalledTimes(1)
    expect(mockSelect).toHaveBeenCalledWith()
  })

  it("should request a single inserted favorite", async () => {
    await addFavorite(103)

    expect(mockSingle).toHaveBeenCalledTimes(1)
    expect(mockSingle).toHaveBeenCalledWith()
  })

  it("should return the inserted favorite", async () => {
    const result = await addFavorite(103)

    expect(result).toEqual(mockNewFavorite)
  })

  it("should throw an error when authentication fails", async () => {
    const error = mockAuthenticationError()

    await expect(addFavorite(103)).rejects.toBe(error)

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it("should throw an error when the user is not authenticated", async () => {
    mockUnauthenticatedUser()

    await expect(addFavorite(103)).rejects.toThrow(
      "Usuario no autenticado"
    )

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it("should throw an error when inserting a favorite fails", async () => {
    const error = createDatabaseError(
      "Failed to insert favorite",
      "42501"
    )

    mockSingle.mockResolvedValue({
      data: null,
      error,
    })

    await expect(addFavorite(103)).rejects.toBe(error)
  })

  it("should propagate a duplicate favorite error", async () => {
    const error = createDatabaseError(
      "Duplicate favorite",
      "23505"
    )

    mockSingle.mockResolvedValue({
      data: null,
      error,
    })

    await expect(addFavorite(101)).rejects.toBe(error)
  })
})

describe("removeFavorite", () => {
  beforeEach(() => {
    mockDelete.mockReturnValue({
      eq: mockEq,
    })

    mockEq
      .mockReturnValueOnce({
        eq: mockEq,
      })
      .mockResolvedValueOnce({
        error: null,
      })
  })

  it("should get the authenticated user", async () => {
    await removeFavorite(101)

    expect(mockGetUser).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledWith()
  })

  it("should access the favorites table", async () => {
    await removeFavorite(101)

    expect(mockFrom).toHaveBeenCalledTimes(1)
    expect(mockFrom).toHaveBeenCalledWith("favorites")
  })

  it("should execute the delete operation", async () => {
    await removeFavorite(101)

    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith()
  })

  it("should filter the deletion by user ID and movie ID", async () => {
    await removeFavorite(101)

    expect(mockEq).toHaveBeenCalledTimes(2)

    expect(mockEq).toHaveBeenNthCalledWith(
      1,
      "user_id",
      mockUser.id
    )

    expect(mockEq).toHaveBeenNthCalledWith(
      2,
      "movie_id",
      101
    )
  })

  it("should return undefined when deletion succeeds", async () => {
    await expect(
      removeFavorite(101)
    ).resolves.toBeUndefined()
  })

  it("should throw an error when authentication fails", async () => {
    const error = mockAuthenticationError()

    await expect(removeFavorite(101)).rejects.toBe(error)

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it("should throw an error when the user is not authenticated", async () => {
    mockUnauthenticatedUser()

    await expect(removeFavorite(101)).rejects.toThrow(
      "Usuario no autenticado"
    )

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it("should throw an error when deleting a favorite fails", async () => {
    const error = createDatabaseError(
      "Failed to delete favorite",
      "42501"
    )

    mockEq.mockReset()

    mockEq
      .mockReturnValueOnce({
        eq: mockEq,
      })
      .mockResolvedValueOnce({
        error,
      })

    await expect(removeFavorite(101)).rejects.toBe(error)
  })
})