/**
 * Password strength levels
 */
export enum PasswordStrength {
  VERY_WEAK = 0,
  WEAK = 1,
  MEDIUM = 2,
  STRONG = 3,
  VERY_STRONG = 4
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  /**
   * Password strength level (0-4)
   */
  strength: PasswordStrength;
  
  /**
   * Score between 0-100
   */
  score: number;
  
  /**
   * Whether the password meets minimum requirements
   */
  isValid: boolean;
  
  /**
   * Validation messages (error or suggestions)
   */
  messages: string[];
  
  /**
   * Specific failed checks
   */
  failedChecks: string[];
  
  /**
   * Estimated crack time (in seconds)
   */
  crackTimeSeconds?: number;
  
  /**
   * Human-readable crack time estimate
   */
  crackTimeDisplay?: string;
}

/**
 * Password policy options
 */
export interface PasswordPolicyOptions {
  /**
   * Minimum password length (default: 8)
   */
  minLength?: number;
  
  /**
   * Require at least one uppercase letter
   */
  requireUppercase?: boolean;
  
  /**
   * Require at least one lowercase letter
   */
  requireLowercase?: boolean;
  
  /**
   * Require at least one number
   */
  requireNumbers?: boolean;
  
  /**
   * Require at least one special character
   */
  requireSpecial?: boolean;
  
  /**
   * Minimum strength level required (0-4)
   */
  minStrength?: PasswordStrength;
  
  /**
   * Maximum consecutive repeated characters
   */
  maxRepeatedChars?: number;
  
  /**
   * Reject common passwords
   */
  rejectCommonPasswords?: boolean;
}

/**
 * Service for validating password strength and enforcing password policies
 */
export class PasswordValidator {
  private static readonly DEFAULT_OPTIONS: PasswordPolicyOptions = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    minStrength: PasswordStrength.MEDIUM,
    maxRepeatedChars: 3,
    rejectCommonPasswords: true
  };
  
  private static readonly COMMON_PASSWORDS = [
    'password', '123456', '12345678', 'qwerty', 'admin',
    'welcome', 'welcome1', 'password1', 'qwerty123',
    'letmein', 'monkey', '1234567', 'football', 'iloveyou',
    'admin123', 'baseball', 'abc123', 'dragon', 'sunshine'
  ];

  private static readonly SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  private static readonly UPPERCASE_REGEX = /[A-Z]/;
  private static readonly LOWERCASE_REGEX = /[a-z]/;
  private static readonly NUMBERS_REGEX = /[0-9]/;
  private static readonly REPEATED_CHARS_REGEX = /(.)\1{2,}/;
  
  /**
   * Validate a password against the policy
   * 
   * @param password Password to validate
   * @param options Password policy options
   * @returns Validation result with strength assessment
   */
  public static validate(
    password: string,
    options: PasswordPolicyOptions = {}
  ): PasswordValidationResult {
    // Merge with default options
    const policy = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Initialize result
    const result: PasswordValidationResult = {
      strength: PasswordStrength.VERY_WEAK,
      score: 0,
      isValid: true,
      messages: [],
      failedChecks: []
    };
    
    // Empty password
    if (!password) {
      result.isValid = false;
      result.messages.push('Password is required');
      result.failedChecks.push('required');
      return result;
    }
    
    // Check minimum length
    if (password.length < policy.minLength!) {
      result.isValid = false;
      result.messages.push(`Password must be at least ${policy.minLength} characters`);
      result.failedChecks.push('minLength');
    }
    
    // Check for uppercase letters
    if (policy.requireUppercase && !this.UPPERCASE_REGEX.test(password)) {
      result.isValid = false;
      result.messages.push('Password must contain at least one uppercase letter');
      result.failedChecks.push('uppercase');
    }
    
    // Check for lowercase letters
    if (policy.requireLowercase && !this.LOWERCASE_REGEX.test(password)) {
      result.isValid = false;
      result.messages.push('Password must contain at least one lowercase letter');
      result.failedChecks.push('lowercase');
    }
    
    // Check for numbers
    if (policy.requireNumbers && !this.NUMBERS_REGEX.test(password)) {
      result.isValid = false;
      result.messages.push('Password must contain at least one number');
      result.failedChecks.push('numbers');
    }
    
    // Check for special characters
    if (policy.requireSpecial && !this.SPECIAL_CHARS_REGEX.test(password)) {
      result.isValid = false;
      result.messages.push('Password must contain at least one special character');
      result.failedChecks.push('special');
    }
    
    // Check for repeated characters
    if (policy.maxRepeatedChars && new RegExp(`(.)\\1{${policy.maxRepeatedChars - 1},}`).test(password)) {
      result.isValid = false;
      result.messages.push(`Password cannot contain ${policy.maxRepeatedChars} or more consecutive identical characters`);
      result.failedChecks.push('repeatedChars');
    }
    
    // Check if password is in common list
    if (policy.rejectCommonPasswords && 
        this.COMMON_PASSWORDS.includes(password.toLowerCase())) {
      result.isValid = false;
      result.messages.push('Password is too common and easily guessable');
      result.failedChecks.push('commonPassword');
    }
    
    // Calculate strength score (0-100)
    let score = 0;
    
    // Base score from length (up to 40 points)
    score += Math.min(password.length * 4, 40);
    
    // Points for character diversity (up to 20 points)
    const hasUpper = this.UPPERCASE_REGEX.test(password);
    const hasLower = this.LOWERCASE_REGEX.test(password);
    const hasNumber = this.NUMBERS_REGEX.test(password);
    const hasSpecial = this.SPECIAL_CHARS_REGEX.test(password);
    
    const charTypeCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    score += charTypeCount * 5;
    
    // Bonus for mixed character types (up to 20 points)
    if (hasUpper && hasLower) score += 5;
    if (hasLower && hasNumber) score += 5;
    if (hasUpper && hasNumber) score += 5;
    if (hasSpecial && (hasUpper || hasLower || hasNumber)) score += 5;
    
    // Penalty for repeated patterns (up to -30 points)
    const repeatedChars = (password.match(this.REPEATED_CHARS_REGEX) || []).length;
    score -= repeatedChars * 10;
    
    // Penalty for common passwords (up to -30 points)
    if (this.COMMON_PASSWORDS.includes(password.toLowerCase())) {
      score -= 30;
    }
    
    // Ensure score is between 0-100
    result.score = Math.max(0, Math.min(100, score));
    
    // Determine strength level
    if (result.score >= 90) {
      result.strength = PasswordStrength.VERY_STRONG;
    } else if (result.score >= 70) {
      result.strength = PasswordStrength.STRONG;
    } else if (result.score >= 50) {
      result.strength = PasswordStrength.MEDIUM;
    } else if (result.score >= 25) {
      result.strength = PasswordStrength.WEAK;
    } else {
      result.strength = PasswordStrength.VERY_WEAK;
    }
    
    // Check if strength meets minimum requirement
    if (result.strength < policy.minStrength!) {
      result.isValid = false;
      
      const strengthNames = [
        'very weak',
        'weak',
        'medium',
        'strong',
        'very strong'
      ];
      
      result.messages.push(`Password strength (${strengthNames[result.strength]}) does not meet the minimum requirement (${strengthNames[policy.minStrength!]})`);
      result.failedChecks.push('minStrength');
    }
    
    // Estimate crack time (very simplified)
    this.calculateCrackTime(result, password);
    
    return result;
  }
  
  /**
   * Calculate estimated time to crack the password
   * This is a simplified estimate - for production, use a more sophisticated algorithm
   */
  private static calculateCrackTime(result: PasswordValidationResult, password: string): void {
    // Simplified crack time calculation
    // Assuming 10 billion guesses per second for a sophisticated attacker
    
    const guessesPerSecond = 10000000000;
    let possibleCombinations = 0;
    
    // Calculate character set size
    let charSetSize = 0;
    if (this.LOWERCASE_REGEX.test(password)) charSetSize += 26;
    if (this.UPPERCASE_REGEX.test(password)) charSetSize += 26;
    if (this.NUMBERS_REGEX.test(password)) charSetSize += 10;
    if (this.SPECIAL_CHARS_REGEX.test(password)) charSetSize += 33;
    
    // If we couldn't determine charset, use reasonable default
    if (charSetSize === 0) charSetSize = 26;
    
    // Calculate possible combinations
    possibleCombinations = Math.pow(charSetSize, password.length);
    
    // Calculate crack time in seconds
    const crackTimeSeconds = possibleCombinations / guessesPerSecond;
    result.crackTimeSeconds = crackTimeSeconds;
    
    // Generate human-readable time
    result.crackTimeDisplay = this.formatTimespan(crackTimeSeconds);
  }
  
  /**
   * Format a timespan in seconds to a human-readable string
   */
  private static formatTimespan(seconds: number): string {
    if (seconds < 1) {
      return 'instantly';
    }
    
    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    }
    
    if (seconds < 3600) {
      return `${Math.round(seconds / 60)} minutes`;
    }
    
    if (seconds < 86400) {
      return `${Math.round(seconds / 3600)} hours`;
    }
    
    if (seconds < 2592000) {
      return `${Math.round(seconds / 86400)} days`;
    }
    
    if (seconds < 31536000) {
      return `${Math.round(seconds / 2592000)} months`;
    }
    
    if (seconds < 3153600000) {
      return `${Math.round(seconds / 31536000)} years`;
    }
    
    return 'centuries';
  }
  
  /**
   * Generate a suggestion for a stronger password
   * 
   * @returns Randomly generated strong password
   */
  public static generateStrongPassword(length = 16): string {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    
    const allChars = lowerChars + upperChars + numbers + specialChars;
    let password = '';
    
    // Ensure at least one character from each set
    password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
    password += upperChars[Math.floor(Math.random() * upperChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password characters
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }
} 