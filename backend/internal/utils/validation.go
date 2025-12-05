package utils

import (
	"regexp"
	"strings"
)

// ValidateEmail validates email format
func ValidateEmail(email string) bool {
	const emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)
	return re.MatchString(email)
}

// ValidatePassword validates password strength
func ValidatePassword(password string) (bool, string) {
	if len(password) < 8 {
		return false, "Password must be at least 8 characters long"
	}

	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|` + "`" + `]`).MatchString(password)

	if !hasUpper {
		return false, "Password must contain at least one uppercase letter"
	}
	if !hasLower {
		return false, "Password must contain at least one lowercase letter"
	}
	if !hasNumber {
		return false, "Password must contain at least one number"
	}
	if !hasSpecial {
		return false, "Password must contain at least one special character"
	}

	return true, ""
}

// ValidatePasswordMatch validates that passwords match
func ValidatePasswordMatch(password, confirmPassword string) bool {
	return password == confirmPassword
}

// ValidatePhoneNumber validates phone number format (basic)
func ValidatePhoneNumber(phone string) bool {
	if phone == "" {
		return true // Optional field
	}

	// Remove common phone number separators
	cleaned := strings.Map(func(r rune) rune {
		if (r >= '0' && r <= '9') || r == '+' {
			return r
		}
		return -1
	}, phone)

	if len(cleaned) < 10 || len(cleaned) > 15 {
		return false
	}

	return true
}

// ValidateFullName validates full name
func ValidateFullName(name string) bool {
	trimmed := strings.TrimSpace(name)
	if len(trimmed) < 2 {
		return false
	}
	if len(trimmed) > 255 {
		return false
	}
	return true
}

// ValidateRole validates user role
func ValidateRole(role string) bool {
	validRoles := map[string]bool{
		"super_admin": true,
		"admin":       true,
		"supplier":    true,
		"parent":      true,
	}
	return validRoles[role]
}

// SanitizeEmail sanitizes email to lowercase and trim whitespace
func SanitizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

// SanitizeInput removes leading/trailing whitespace
func SanitizeInput(input string) string {
	return strings.TrimSpace(input)
}

// ValidateLoginRequest validates login request
func ValidateLoginRequest(email, password string) (bool, string) {
	email = SanitizeEmail(email)

	if email == "" {
		return false, "Email is required"
	}

	if !ValidateEmail(email) {
		return false, "Invalid email format"
	}

	if password == "" {
		return false, "Password is required"
	}

	if len(password) < 6 {
		return false, "Password must be at least 6 characters"
	}

	return true, ""
}

// ValidateRegisterRequest validates registration request
func ValidateRegisterRequest(email, password, confirmPassword, fullName, role string) (bool, string) {
	email = SanitizeEmail(email)

	if email == "" {
		return false, "Email is required"
	}

	if !ValidateEmail(email) {
		return false, "Invalid email format"
	}

	if password == "" {
		return false, "Password is required"
	}

	if confirmPassword == "" {
		return false, "Password confirmation is required"
	}

	if !ValidatePasswordMatch(password, confirmPassword) {
		return false, "Passwords do not match"
	}

	valid, msg := ValidatePassword(password)
	if !valid {
		return false, msg
	}

	if !ValidateFullName(fullName) {
		return false, "Full name must be at least 2 characters"
	}

	if !ValidateRole(role) {
		return false, "Invalid role. Must be: parent, supplier, or admin"
	}

	return true, ""
}

// ValidateChangePasswordRequest validates change password request
func ValidateChangePasswordRequest(oldPassword, newPassword, confirmPassword string) (bool, string) {
	if oldPassword == "" {
		return false, "Old password is required"
	}

	if newPassword == "" {
		return false, "New password is required"
	}

	if confirmPassword == "" {
		return false, "Password confirmation is required"
	}

	if oldPassword == newPassword {
		return false, "New password must be different from old password"
	}

	if !ValidatePasswordMatch(newPassword, confirmPassword) {
		return false, "Passwords do not match"
	}

	valid, msg := ValidatePassword(newPassword)
	if !valid {
		return false, msg
	}

	return true, ""
}
