import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthApiError, PostgrestError } from "@supabase/supabase-js"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import { registerUser, loginUser, logoutUser, isUsernameAvailable } from "./authService"

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    rpc: vi.fn(),
  },
}))

const mockSignUp = vi.mocked(supabase.auth.signUp)
const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
const mockSignOut = vi.mocked(supabase.auth.signOut)
const mockRpc = vi.mocked(supabase.rpc)

const mockUser: User = {
  id: "test-user-id",
  aud: "authenticated",
  email: "usuario@gmail.com",
  role: "authenticated",
  app_metadata: {},
  user_metadata: {
    username: "testuser",
  },
  created_at: "2026-01-01T00:00:00Z",
}

const mockSession: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: mockUser,
}

const mockAuthData = {
  user: mockUser,
  session: mockSession,
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe("registerUser", () => {
  it("should call Supabase signUp with the correct credentials", async () => {
    mockSignUp.mockResolvedValue({
      data: mockAuthData,
      error: null,
    })

    await registerUser(
      "usuario@gmail.com",
      "Password123",
      "testuser"
    )

    expect(mockSignUp).toHaveBeenCalledTimes(1)

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "usuario@gmail.com",
      password: "Password123",
      options: {
        data: {
          username: "testuser",
        },
      },
    })
  })

  it("should return authentication data after successful registration", async () => {
    mockSignUp.mockResolvedValue({
      data: mockAuthData,
      error: null,
    })

    const result = await registerUser(
      "usuario@gmail.com",
      "Password123",
      "testuser"
    )

    expect(result).toEqual(mockAuthData)
  })

  it("should return registration data when no session is created", async () => {
    const registrationData = {
      user: mockUser,
      session: null,
    }

    mockSignUp.mockResolvedValue({
      data: registrationData,
      error: null,
    })

    const result = await registerUser(
      "usuario@gmail.com",
      "Password123",
      "testuser"
    )

    expect(result).toEqual(registrationData)
    expect(result.session).toBeNull()
  })

  it("should throw an error when registration fails", async () => {
    const error = new AuthApiError(
      "Registration failed",
      400,
      "validation_failed"
    )

    mockSignUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error,
    })

    await expect(
      registerUser(
        "usuario@gmail.com",
        "Password123",
        "testuser"
      )
    ).rejects.toBe(error)
  })
})

describe("loginUser", () => {
  it("should call Supabase signInWithPassword with the correct credentials", async () => {
    mockSignIn.mockResolvedValue({
      data: mockAuthData,
      error: null,
    })

    await loginUser("usuario@gmail.com", "Password123")

    expect(mockSignIn).toHaveBeenCalledTimes(1)

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "usuario@gmail.com",
      password: "Password123",
    })
  })

  it("should return authentication data after successful login", async () => {
    mockSignIn.mockResolvedValue({
      data: mockAuthData,
      error: null,
    })

    const result = await loginUser(
      "usuario@gmail.com",
      "Password123"
    )

    expect(result).toEqual(mockAuthData)
  })

  it("should throw an error when login fails", async () => {
    const error = new AuthApiError(
      "Invalid login credentials",
      400,
      "invalid_credentials"
    )

    mockSignIn.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error,
    })

    await expect(
      loginUser("usuario@gmail.com", "WrongPassword")
    ).rejects.toBe(error)
  })
})

describe("logoutUser", () => {
  it("should call Supabase signOut", async () => {
    mockSignOut.mockResolvedValue({
      error: null,
    })

    await logoutUser()

    expect(mockSignOut).toHaveBeenCalledTimes(1)
    expect(mockSignOut).toHaveBeenCalledWith()
  })

  it("should complete successfully when logout succeeds", async () => {
    mockSignOut.mockResolvedValue({
      error: null,
    })

    await expect(logoutUser()).resolves.toBeUndefined()
  })

  it("should throw an error when logout fails", async () => {
    const error = new AuthApiError(
      "Logout failed",
      500,
      "unexpected_failure"
    )

    mockSignOut.mockResolvedValue({
      error,
    })

    await expect(logoutUser()).rejects.toBe(error)
  })
})

describe("isUsernameAvailable", () => {
  it("should call the correct Supabase RPC function", async () => {
    mockRpc.mockResolvedValue({
      success: true,
      data: true,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    })

    await isUsernameAvailable("testuser")

    expect(mockRpc).toHaveBeenCalledTimes(1)

    expect(mockRpc).toHaveBeenCalledWith(
      "is_username_available",
      {
        p_username: "testuser",
      }
    )
  })

  it("should return true when the username is available", async () => {
    mockRpc.mockResolvedValue({
      success: true,
      data: true,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    })

    const result = await isUsernameAvailable("testuser")

    expect(result).toBe(true)
  })

  it("should return false when the username is already taken", async () => {
    mockRpc.mockResolvedValue({
      success: true,
      data: false,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    })

    const result = await isUsernameAvailable("testuser")

    expect(result).toBe(false)
  })

  it("should trim the username before calling Supabase", async () => {
    mockRpc.mockResolvedValue({
      success: true,
      data: true,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    })

    await isUsernameAvailable("  testuser  ")

    expect(mockRpc).toHaveBeenCalledWith(
      "is_username_available",
      {
        p_username: "testuser",
      }
    )
  })

  it("should throw an error when the RPC request fails", async () => {
    const error = new PostgrestError({
      message: "Username verification failed",
      details: "",
      hint: "",
      code: "PGRST202",
    })

    mockRpc.mockResolvedValue({
      success: false,
      data: null,
      error,
      count: null,
      status: 404,
      statusText: "Not Found",
    })

    await expect(
      isUsernameAvailable("testuser")
    ).rejects.toBe(error)
  })
})