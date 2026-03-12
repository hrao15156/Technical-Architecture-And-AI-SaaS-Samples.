// Input validation utilities

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateName(name: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  
  if (name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  // Check for potentially malicious content
  if (/<script|javascript:|data:/i.test(name)) {
    errors.push('Name contains invalid characters')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export function validateRole(role: string): boolean {
  return ['admin', 'sales_manager', 'sales_rep', 'sales_agent'].includes(role)
}

