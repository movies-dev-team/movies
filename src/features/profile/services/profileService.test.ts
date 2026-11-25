import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthApiError, PostgrestError } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"
import { getUserProfile } from "./profileService"
import content from "@/data/content.json"

const { mockGetUser, mockFrom, mockSelect, mockEq, mockSingle } =
  vi.hoisted(() => ({
    mockGetUser: vi.fn(),
    mockFrom: vi.fn(),
    mockSelect: vi.fn(),
    mockEq: vi.fn(),
    mockSingle: vi.fn(),
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

const mockProfile = {
  username: "testuser",
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
  })

  mockSelect.mockReturnValue({
    eq: mockEq,
  })

  mockEq.mockReturnValue({
    single: mockSingle,
  })

  mockSingle.mockResolvedValue({
    success: true,
    data: mockProfile,
    error: null,
    count: null,
    status: 200,
    statusText: "OK",
  })
})

describe("getUserProfile", () => {
  it("should call Supabase getUser", async () => {
    await getUserProfile()

    expect(mockGetUser).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledWith()
  })

  it("should query the profiles table", async () => {
    await getUserProfile()

    expect(mockFrom).toHaveBeenCalledTimes(1)
    expect(mockFrom).toHaveBeenCalledWith("profiles")
  })

  it("should select the username column", async () => {
    await getUserProfile()

    expect(mockSelect).toHaveBeenCalledTimes(1)
    expect(mockSelect).toHaveBeenCalledWith("username")
  })

  it("should filter the profile by the authenticated user ID", async () => {
    await getUserProfile()

    expect(mockEq).toHaveBeenCalledTimes(1)
    expect(mockEq).toHaveBeenCalledWith("id", mockUser.id)
  })

  it("should request a single profile", async () => {
    await getUserProfile()

    expect(mockSingle).toHaveBeenCalledTimes(1)
    expect(mockSingle).toHaveBeenCalledWith()
  })

  it("should return the username and email", async () => {
    const result = await getUserProfile()

    expect(result).toEqual({
      username: "testuser",
      email: "usuario@gmail.com",
    })
  })

  it("should handle a user without an email", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          ...mockUser,
          email: undefined,
        },
      },
      error: null,
    })

    const result = await getUserProfile()

    expect(result).toEqual({
      username: "testuser",
      email: undefined,
    })
  })

  it("should throw an error when authentication fails", async () => {
    const error = new AuthApiError(
      "Authentication failed",
      401,
      "bad_jwt"
    )

    mockGetUser.mockResolvedValue({
      data: {
        user: null,
      },
      error,
    })

    await expect(getUserProfile()).rejects.toBe(error)
  })

  it("should throw an error when there is no authenticated user", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: null,
    })

    await expect(getUserProfile()).rejects.toThrow(
      content.auth.messages.unauthenticated
    )
  })

  it("should throw an error when the profile query fails", async () => {
    const error = new PostgrestError({
      message: "Profile not found",
      details: "",
      hint: "",
      code: "PGRST116",
    })

    mockSingle.mockResolvedValue({
      success: false,
      data: null,
      error,
      count: null,
      status: 406,
      statusText: "Not Acceptable",
    })

    await expect(getUserProfile()).rejects.toBe(error)
  })

  it("should not query profiles when authentication fails", async () => {
    const error = new AuthApiError(
      "Authentication failed",
      401,
      "bad_jwt"
    )

    mockGetUser.mockResolvedValue({
      data: {
        user: null,
      },
      error,
    })

    await expect(getUserProfile()).rejects.toBe(error)

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockSelect).not.toHaveBeenCalled()
    expect(mockEq).not.toHaveBeenCalled()
    expect(mockSingle).not.toHaveBeenCalled()
  })

  it("should not query profiles when there is no authenticated user", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: null,
    })

    await expect(getUserProfile()).rejects.toThrow(
      content.auth.messages.unauthenticated
    )

    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockSelect).not.toHaveBeenCalled()
    expect(mockEq).not.toHaveBeenCalled()
    expect(mockSingle).not.toHaveBeenCalled()
  })
})