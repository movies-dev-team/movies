export function validateEmail(email: string): string {
  if (!email.trim()) {
    return "El correo electrónico es obligatorio"
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return "Introduce un correo electrónico válido"
  }
  return ""
}

export function validatePassword(password: string): string {
  if (!password) {
    return "La contraseña es obligatoria"
  }
  return ""
}

export function validateRegisterPassword(password: string): string {
  if (!password) {
    return "La contraseña es obligatoria"
  }
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres"
  }
  return ""
}
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string {
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden"
  }
  return ""
}