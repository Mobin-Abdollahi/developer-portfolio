// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.length <= 100;
};

export const validateMessage = (message: string): boolean => {
  return message.trim().length >= 10 && message.length <= 5000;
};

export const validateContactForm = (data: {
  name?: string;
  email?: string;
  message?: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name) {
    errors.name = "Name is required";
  } else if (!validateName(data.name)) {
    errors.name = "Name must be between 2 and 100 characters";
  }

  // Validate email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Validate message
  if (!data.message) {
    errors.message = "Message is required";
  } else if (!validateMessage(data.message)) {
    errors.message = "Message must be between 10 and 5000 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Rate limiting helper
const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 5000); // Limit length
};
