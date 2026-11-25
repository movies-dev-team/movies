import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter, Routes, Route } from "react-router"
import type { User, Session } from "@supabase/supabase-js"
import LoginForm from "./LoginForm"
import { loginUser } from "../services/authService"
import content from "@/data/content.json"

vi.mock("../services/authService", () => ({
  loginUser: vi.fn(),
}))

const mockLoginUser = vi.mocked(loginUser)

const mockUser: User = {
  id: "test-user-id",
  aud: "authenticated",
  email: "usuario@gmail.com",
  role: "authenticated",
  app_metadata: {},
  user_metadata: {},
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

interface LoginFormSetup {
  user: ReturnType<typeof userEvent.setup>
  emailInput: HTMLElement
  passwordInput: HTMLElement
  submitButton: HTMLElement
}

function renderLoginForm(): LoginFormSetup {
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/app" element={<h1>CatalogPage</h1>} />
        <Route path="/register" element={<h1>RegisterPage</h1>} />
      </Routes>
    </MemoryRouter>
  )

  const setup: LoginFormSetup = {
    user,
    emailInput: screen.getByLabelText(content.auth.emailLabel),
    passwordInput: screen.getByLabelText(content.auth.passwordLabel),
    submitButton: screen.getByRole("button", {
      name: content.auth.login.button,
    }),
  }

  return setup
}

beforeEach(() => {
  vi.resetAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("LoginForm", () => {
  it("should render the login form correctly", () => {
    const { emailInput, passwordInput, submitButton } = renderLoginForm()

    expect(
      screen.getByRole("heading", {
        name: content.auth.login.title,
      })
    ).toBeInTheDocument()

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeEnabled()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("should allow the user to enter an email", async () => {
    const { user, emailInput } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")

    expect(emailInput).toHaveValue("usuario@gmail.com")
  })

  it("should allow the user to enter a password", async () => {
    const { user, passwordInput } = renderLoginForm()

    await user.type(passwordInput, "Password123")

    expect(passwordInput).toHaveValue("Password123")
  })

  it("should hide the password by default", () => {
    const { passwordInput } = renderLoginForm()

    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("should show and hide the password", async () => {
    const { user, passwordInput } = renderLoginForm()

    const toggleButton = screen.getByRole("button", {
      name: content.auth.accessibility.showPassword,
    })

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("should update password accessibility attributes", async () => {
    const { user } = renderLoginForm()

    const toggleButton = screen.getByRole("button", {
      name: content.auth.accessibility.showPassword,
    })

    expect(toggleButton).toHaveAttribute("aria-pressed", "false")

    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute("aria-pressed", "true")
    expect(toggleButton).toHaveAccessibleName(
      content.auth.accessibility.hidePassword
    )

    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute("aria-pressed", "false")
    expect(toggleButton).toHaveAccessibleName(
      content.auth.accessibility.showPassword
    )
  })

  it("should reject an empty email", async () => {
    const { user, submitButton } = renderLoginForm()

    await user.click(submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.emailRequired
    )

    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it("should reject an invalid email", async () => {
    const { user, emailInput, passwordInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "invalid-email")
    await user.type(passwordInput, "Password123")
    await user.click(submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.invalidEmail
    )

    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it("should reject an empty password", async () => {
    const { user, emailInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")
    await user.click(submitButton)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.validation.passwordRequired
    )

    expect(mockLoginUser).not.toHaveBeenCalled()
  })

  it("should call loginUser with the correct credentials", async () => {
    mockLoginUser.mockResolvedValue(mockAuthData)

    const { user, emailInput, passwordInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")
    await user.type(passwordInput, "Password123")
    await user.click(submitButton)

    expect(mockLoginUser).toHaveBeenCalledTimes(1)

    expect(mockLoginUser).toHaveBeenCalledWith(
      "usuario@gmail.com",
      "Password123"
    )
  })

  it("should redirect to the catalog after successful login", async () => {
    mockLoginUser.mockResolvedValue(mockAuthData)

    const { user, emailInput, passwordInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")
    await user.type(passwordInput, "Password123")
    await user.click(submitButton)

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument()
  })

  it("should display an error when authentication fails", async () => {
    mockLoginUser.mockRejectedValue(new Error("Invalid credentials"))

    const { user, emailInput, passwordInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")
    await user.type(passwordInput, "WrongPassword")
    await user.click(submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.loginError
    )

    expect(
      screen.queryByRole("heading", {
        name: "CatalogPage",
      })
    ).not.toBeInTheDocument()

    expect(submitButton).toBeEnabled()
  })

  it("should disable the submit button while loading", async () => {
    let rejectLogin!: (reason: Error) => void

    const pendingLogin = new Promise<Awaited<ReturnType<typeof loginUser>>>(
      (_, reject) => {
        rejectLogin = reject
      }
    )

    mockLoginUser.mockReturnValue(pendingLogin)

    const { user, emailInput, passwordInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")
    await user.type(passwordInput, "Password123")
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(content.auth.login.loading)

    await user.click(submitButton)

    expect(mockLoginUser).toHaveBeenCalledTimes(1)

    await act(async () => {
      rejectLogin(new Error("Authentication failed"))
    })

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    expect(submitButton).toHaveTextContent(content.auth.login.button)

    expect(screen.getByRole("alert")).toHaveTextContent(
      content.auth.messages.loginError
    )
  })

  it("should allow retrying after a failed login", async () => {
    mockLoginUser
      .mockRejectedValueOnce(new Error("Invalid credentials"))
      .mockResolvedValueOnce(mockAuthData)

    const { user, emailInput, passwordInput, submitButton } = renderLoginForm()

    await user.type(emailInput, "usuario@gmail.com")
    await user.type(passwordInput, "WrongPassword")
    await user.click(submitButton)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      content.auth.messages.loginError
    )

    await user.clear(passwordInput)
    await user.type(passwordInput, "Password123")
    await user.click(submitButton)

    expect(mockLoginUser).toHaveBeenCalledTimes(2)

    expect(
      await screen.findByRole("heading", {
        name: "CatalogPage",
      })
    ).toBeInTheDocument()
  })

  it("should navigate to the register page", async () => {
    const { user } = renderLoginForm()

    const registerLink = screen.getByRole("link", {
      name: content.auth.login.accountLink,
    })

    expect(registerLink).toHaveAttribute("href", "/register")

    await user.click(registerLink)

    expect(
      await screen.findByRole("heading", {
        name: "RegisterPage",
      })
    ).toBeInTheDocument()
  })
})