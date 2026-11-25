import { describe, it, expect } from "vitest"
import { validateEmail, validatePassword, validateRegisterPassword, validateConfirmPassword } from "./authValidation"
import content from "@/data/content.json"

describe("validateEmail", () => {
  it.each([
    "usuario@gmail.com",
    "usuario@correo.es",
    "usuario.nombre@gmail.com",
    " usuario@gmail.com ",
  ])("should accept valid email: %s", (email) => {
    expect(validateEmail(email)).toBe("")
  })

  it.each(["", "   "])(
    "should reject empty email: '%s'",
    (email) => {
      expect(validateEmail(email)).toBe(
        content.auth.validation.emailRequired
      )
    }
  )

  it.each([
    "usuario",
    "usuario@gmail",
    "@gmail.com",
    "usuario @gmail.com",
    "usuario@@gmail.com",
    "usuario@gmail.",
  ])("should reject invalid email: %s", (email) => {
    expect(validateEmail(email)).toBe(
      content.auth.validation.invalidEmail
    )
  })
})

describe("validatePassword", () => {
  it.each([
    "Password123",
    "123",
    "a",
  ])("should accept non-empty password: %s", (password) => {
    expect(validatePassword(password)).toBe("")
  })

  it("should reject an empty password", () => {
    expect(validatePassword("")).toBe(
      content.auth.validation.passwordRequired
    )
  })
})

describe("validateRegisterPassword", () => {
  it("should reject an empty password", () => {
    expect(validateRegisterPassword("")).toBe(
      content.auth.validation.passwordRequired
    )
  })

  it.each([
    "a",
    "123456",
    "1234567",
  ])("should reject passwords shorter than 8 characters: %s", (password) => {
    expect(validateRegisterPassword(password)).toBe(
      content.auth.validation.passwordMinLength
    )
  })

  it.each([
    "12345678",
    "123456789",
    "Password123",
  ])("should accept passwords with at least 8 characters: %s", (password) => {
    expect(validateRegisterPassword(password)).toBe("")
  })
})

describe("validateConfirmPassword", () => {
  it.each([
    ["Password123", "Password123"],
    ["12345678", "12345678"],
  ])("should accept matching passwords: %s and %s", (password, confirmPassword) => {
    expect(validateConfirmPassword(password, confirmPassword)).toBe("")
  })

  it.each([
    ["Password123", "Password456"],
    ["Password123", ""],
    ["", "Password123"],
    ["Password123", "password123"],
    ["Password123", "Password123 "],
  ])("should reject mismatched passwords: %s and %s", (password, confirmPassword) => {
    expect(validateConfirmPassword(password, confirmPassword)).toBe(
      content.auth.validation.passwordMismatch
    )
  })
})