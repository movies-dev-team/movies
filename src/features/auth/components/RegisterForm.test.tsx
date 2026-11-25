import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, act, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter, Routes, Route } from "react-router"
import type { User, Session } from "@supabase/supabase-js"
import RegisterForm from "./RegisterForm"
import { registerUser, isUsernameAvailable } from "../services/authService"
import content from "@/data/content.json"

vi.mock("../services/authService", () => ({
  registerUser: vi.fn(),
  isUsernameAvailable: vi.fn(),
}))

const mockRegisterUser = vi.mocked(registerUser)
const mockIsUsernameAvailable = vi.mocked(isUsernameAvailable)

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

interface RegisterFormSetup {
  user: ReturnType<typeof userEvent.setup>
  usernameInput: HTMLElement
  emailInput: HTMLElement
  passwordInput: HTMLElement
  confirmPasswordInput: HTMLElement
  submitButton: HTMLElement
}

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function renderRegisterForm(): RegisterFormSetup {
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/app" element={<h1>CatalogPage</h1>} />
        <Route path="/" element={<h1>LoginPage</h1>} />
      </Routes>
    </MemoryRouter>
  )

  const setup: RegisterFormSetup = {
    user,
    usernameInput: screen.getByLabelText(
      content.auth.register.usernameLabel
    ),
    emailInput: screen.getByLabelText(
      content.auth.emailLabel
    ),
    passwordInput: screen.getByLabelText(
      content.auth.passwordLabel,
      { exact: true }
    ),
    confirmPasswordInput: screen.getByLabelText(
      content.auth.register.confirmPasswordLabel
    ),
    submitButton: screen.getByRole("button", {
      name: content.auth.register.button,
    }),
  }

  return setup
}

async function fillRegisterForm(
  setup: RegisterFormSetup,
  overrides: Partial<RegisterFormData> = {}
) {
  const data: RegisterFormData = {
    username: "testuser",
    email: "usuario@gmail.com",
    password: "Password123",
    confirmPassword: "Password123",
    ...overrides,
  }

  if (data.username) {
    await setup.user.type(setup.usernameInput, data.username)
  }

  if (data.email) {
    await setup.user.type(setup.emailInput, data.email)
  }

  if (data.password) {
    await setup.user.type(setup.passwordInput, data.password)
  }

  if (data.confirmPassword) {
    await setup.user.type(
      setup.confirmPasswordInput,
      data.confirmPassword
    )
  }
}

beforeEach(() => {
  vi.resetAllMocks()
  mockIsUsernameAvailable.mockResolvedValue(true)
  mockRegisterUser.mockResolvedValue(mockAuthData)
})

afterEach(() => {
  cleanup()
})

describe("RegisterForm", () => {
  it("should render the register form correctly", () => {
    const setup = renderRegisterForm()

    expect(
      screen.getByRole("heading", {
        name: content.auth.register.title,
      })
    ).toBeInTheDocument()

    expect(setup.usernameInput).toBeInTheDocument()
    expect(setup.emailInput).toBeInTheDocument()
    expect(setup.passwordInput).toBeInTheDocument()
    expect(setup.confirmPasswordInput).toBeInTheDocument()
    expect(setup.submitButton).toBeEnabled()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("should allow the user to fill in the form", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup)

    expect(setup.usernameInput).toHaveValue("testuser")
    expect(setup.emailInput).toHaveValue("usuario@gmail.com")
    expect(setup.passwordInput).toHaveValue("Password123")
    expect(setup.confirmPasswordInput).toHaveValue("Password123")
  })

  it("should reject an empty username", async () => {
    const setup = renderRegisterForm()

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.messages.usernameRequired
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should reject a username containing only spaces", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      username: "   ",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.messages.usernameRequired
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should reject an empty email", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      email: "",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.emailRequired
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should reject an invalid email", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      email: "invalid-email",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.invalidEmail
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should reject an empty password", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      password: "",
      confirmPassword: "",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.passwordRequired
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should reject passwords shorter than 8 characters", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      password: "1234567",
      confirmPassword: "1234567",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.passwordMinLength
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should accept passwords with exactly 8 characters", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      password: "12345678",
      confirmPassword: "12345678",
    })

    await setup.user.click(setup.submitButton)

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument()

    expect(mockRegisterUser).toHaveBeenCalledWith(
      "usuario@gmail.com",
      "12345678",
      "testuser"
    )
  })

  it("should reject mismatched passwords", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      confirmPassword: "DifferentPassword",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.passwordMismatch
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should reject an empty password confirmation", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      confirmPassword: "",
    })

    await setup.user.click(setup.submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.passwordMismatch
    )

    expect(mockIsUsernameAvailable).not.toHaveBeenCalled()
    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("should hide both passwords by default", () => {
    const setup = renderRegisterForm()

    expect(setup.passwordInput).toHaveAttribute("type", "password")
    expect(setup.confirmPasswordInput).toHaveAttribute("type", "password")
  })

  it("should show and hide the password independently", async () => {
    const setup = renderRegisterForm()

    const toggleButton = screen.getByRole("button", {
      name: content.auth.accessibility.showPassword,
    })

    expect(toggleButton).toHaveAttribute("aria-pressed", "false")

    await setup.user.click(toggleButton)

    expect(setup.passwordInput).toHaveAttribute("type", "text")
    expect(setup.confirmPasswordInput).toHaveAttribute("type", "password")
    expect(toggleButton).toHaveAttribute("aria-pressed", "true")

    expect(toggleButton).toHaveAccessibleName(
      content.auth.accessibility.hidePassword
    )

    await setup.user.click(toggleButton)

    expect(setup.passwordInput).toHaveAttribute("type", "password")
    expect(toggleButton).toHaveAttribute("aria-pressed", "false")

    expect(toggleButton).toHaveAccessibleName(
      content.auth.accessibility.showPassword
    )
  })

  it("should show and hide the confirmation password independently", async () => {
    const setup = renderRegisterForm()

    const toggleButton = screen.getByRole("button", {
      name: content.auth.accessibility.showConfirmPassword,
    })

    expect(toggleButton).toHaveAttribute("aria-pressed", "false")

    await setup.user.click(toggleButton)

    expect(setup.confirmPasswordInput).toHaveAttribute("type", "text")
    expect(setup.passwordInput).toHaveAttribute("type", "password")
    expect(toggleButton).toHaveAttribute("aria-pressed", "true")

    expect(toggleButton).toHaveAccessibleName(
      content.auth.accessibility.hideConfirmPassword
    )

    await setup.user.click(toggleButton)

    expect(setup.confirmPasswordInput).toHaveAttribute("type", "password")
    expect(toggleButton).toHaveAttribute("aria-pressed", "false")

    expect(toggleButton).toHaveAccessibleName(
      content.auth.accessibility.showConfirmPassword
    )
  })

  it("should check username availability", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(mockIsUsernameAvailable).toHaveBeenCalledTimes(1)
    expect(mockIsUsernameAvailable).toHaveBeenCalledWith("testuser")

    await screen.findByRole("heading", {
      name: "CatalogPage",
    })
  })

  it("should reject an unavailable username", async () => {
    mockIsUsernameAvailable.mockResolvedValue(false)

    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.usernameTaken
    )

    expect(mockRegisterUser).not.toHaveBeenCalled()
    expect(setup.submitButton).toBeEnabled()
  })

  it("should trim the username before checking availability and registering", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup, {
      username: "  testuser  ",
    })

    await setup.user.click(setup.submitButton)

    await screen.findByRole("heading", {
      name: "CatalogPage",
    })

    expect(mockIsUsernameAvailable).toHaveBeenCalledWith("testuser")

    expect(mockRegisterUser).toHaveBeenCalledWith(
      "usuario@gmail.com",
      "Password123",
      "testuser"
    )
  })

  it("should register the user with the correct credentials", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    await screen.findByRole("heading", {
      name: "CatalogPage",
    })

    expect(mockRegisterUser).toHaveBeenCalledTimes(1)

    expect(mockRegisterUser).toHaveBeenCalledWith(
      "usuario@gmail.com",
      "Password123",
      "testuser"
    )
  })

  it("should redirect to the catalog after successful registration", async () => {
    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument()
  })

  it("should display an error when no session is returned", async () => {
    mockRegisterUser.mockResolvedValue({
      user: mockUser,
      session: null,
    })

    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.sessionError
    )

    expect(
      screen.queryByRole("heading", {
        name: "CatalogPage",
      })
    ).not.toBeInTheDocument()

    expect(setup.submitButton).toBeEnabled()
  })

  it("should display an error when username verification fails", async () => {
    mockIsUsernameAvailable.mockRejectedValue(
      new Error("Username verification failed")
    )

    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.registerError
    )

    expect(mockRegisterUser).not.toHaveBeenCalled()
    expect(setup.submitButton).toBeEnabled()
  })

  it("should display an error when registration fails", async () => {
    mockRegisterUser.mockRejectedValue(
      new Error("Registration failed")
    )

    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.registerError
    )

    expect(
      screen.queryByRole("heading", {
        name: "CatalogPage",
      })
    ).not.toBeInTheDocument()

    expect(setup.submitButton).toBeEnabled()
  })

  it("should disable the submit button while loading", async () => {
    let resolveAvailability!: (value: boolean) => void

    const pendingAvailability = new Promise<boolean>((resolve) => {
      resolveAvailability = resolve
    })

    mockIsUsernameAvailable.mockReturnValue(pendingAvailability)

    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(setup.submitButton).toBeDisabled()

    expect(setup.submitButton).toHaveTextContent(
      content.auth.register.loading
    )

    expect(mockRegisterUser).not.toHaveBeenCalled()

    await setup.user.click(setup.submitButton)

    expect(mockIsUsernameAvailable).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveAvailability(false)
    })

    await waitFor(() => {
      expect(setup.submitButton).toBeEnabled()
    })

    expect(setup.submitButton).toHaveTextContent(
      content.auth.register.button
    )
  })

  it("should allow retrying after a failed registration", async () => {
    mockRegisterUser
      .mockRejectedValueOnce(new Error("Registration failed"))
      .mockResolvedValueOnce(mockAuthData)

    const setup = renderRegisterForm()

    await fillRegisterForm(setup)
    await setup.user.click(setup.submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.registerError
    )

    await setup.user.click(setup.submitButton)

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument()

    expect(mockRegisterUser).toHaveBeenCalledTimes(2)
  })

  it("should navigate to the login page", async () => {
    const setup = renderRegisterForm()

    const loginLink = screen.getByRole("link", {
      name: content.auth.register.accountLink,
    })

    expect(loginLink).toHaveAttribute("href", "/")

    await setup.user.click(loginLink)

    expect(
      await screen.findByRole("heading", {
        name: "LoginPage",
      })
    ).toBeInTheDocument()
  })
})