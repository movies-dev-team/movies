import content from "@/data/content.json"

export function validateEmail(email: string): string {
  if (!email.trim()) {
    return content.auth.validation.emailRequired
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email.trim())) {
    return content.auth.validation.invalidEmail
  }

  return ""
}

export function validatePassword(password: string): string {
  if (!password) {
    return content.auth.validation.passwordRequired
  }

  return ""
}

export function validateRegisterPassword(password: string): string {
  if (!password) {
    return content.auth.validation.passwordRequired
  }

  if (password.length < 8) {
    return content.auth.validation.passwordMinLength
  }

  return ""
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string {
  if (password !== confirmPassword) {
    return content.auth.validation.passwordMismatch
  }

  return ""
}