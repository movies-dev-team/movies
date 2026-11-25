import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor, cleanup } from "@testing-library/react"
import { useProfile } from "./useProfile"
import { getUserProfile } from "../services/profileService"
import content from "@/data/content.json"

vi.mock("../services/profileService", () => ({
  getUserProfile: vi.fn(),
}))

const mockGetUserProfile = vi.mocked(getUserProfile)

const mockProfile = {
  username: "testuser",
  email: "usuario@gmail.com",
}

beforeEach(() => {
  vi.resetAllMocks()
  mockGetUserProfile.mockResolvedValue(mockProfile)
})

afterEach(() => {
  cleanup()
})

describe("useProfile", () => {
  it("should initialize profile as null", async () => {
    const { result } = renderHook(() => useProfile())

    expect(result.current.profile).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should initialize loading as true", async () => {
    const { result } = renderHook(() => useProfile())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should initialize error as an empty string", async () => {
    const { result } = renderHook(() => useProfile())

    expect(result.current.error).toBe("")

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should call getUserProfile when the hook mounts", async () => {
    const { result } = renderHook(() => useProfile())

    expect(mockGetUserProfile).toHaveBeenCalledTimes(1)
    expect(mockGetUserProfile).toHaveBeenCalledWith()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should store the user profile after a successful request", async () => {
    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })

    expect(result.current.error).toBe("")
  })

  it("should set loading to false after a successful request", async () => {
    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("should handle a profile without an email", async () => {
    const profileWithoutEmail = {
      username: "testuser",
      email: undefined,
    }

    mockGetUserProfile.mockResolvedValue(profileWithoutEmail)

    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.profile).toEqual(profileWithoutEmail)
    })

    expect(result.current.error).toBe("")
    expect(result.current.loading).toBe(false)
  })

  it("should set an error message when the request fails", async () => {
    mockGetUserProfile.mockRejectedValue(
      new Error("Failed to load profile")
    )

    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.error).toBe(content.profile.loadError)
    })
  })

  it("should keep profile as null when the request fails", async () => {
    mockGetUserProfile.mockRejectedValue(
      new Error("Failed to load profile")
    )

    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profile).toBeNull()
    expect(result.current.error).toBe(content.profile.loadError)
  })

  it("should set loading to false when the request fails", async () => {
    mockGetUserProfile.mockRejectedValue(
      new Error("Failed to load profile")
    )

    const { result } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(content.profile.loadError)
  })

  it("should not fetch the profile again when the hook rerenders", async () => {
    const { result, rerender } = renderHook(() => useProfile())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    rerender()
    rerender()

    expect(mockGetUserProfile).toHaveBeenCalledTimes(1)
    expect(result.current.profile).toEqual(mockProfile)
  })
})