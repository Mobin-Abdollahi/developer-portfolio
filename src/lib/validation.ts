// Validation utilities

export const validateEmail = (email: string): boolean => {
  if (typeof email !== "string") return false;

  const value = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value) && value.length <= 254;
};

export const validateName = (name: string): boolean => {
  if (typeof name !== "string") return false;

  const value = name.trim();
  return value.length >= 2 && value.length <= 100;
};

export const validateMessage = (message: string): boolean => {
  if (typeof message !== "string") return false;

  const value = message.trim();
  return value.length >= 10 && value.length <= 5000;
};

export const validateContactForm = (data: {
  name?: string;
  email?: string;
  message?: string;
}): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  valid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!data.name) {
    errors.name = "Name is required";
  } else if (!validateName(data.name)) {
    errors.name = "Name must be between 2 and 100 characters";
  }

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

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

// Keep this only if you still need local dev fallback.
// For production, use Upstash/Redis in the API route.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

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

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "").substring(0, 5000);
};
