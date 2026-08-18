import { NextRequest, NextResponse } from "next/server";
import {
  validateContactForm,
  checkRateLimit,
  sanitizeInput,
} from "@/lib/validation";

// Security headers helper
function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");
  return response;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting check (5 requests per minute)
    if (!checkRateLimit(clientIp, 5, 60000)) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    // Parse request body
    const body = await request.json();

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name || ""),
      email: sanitizeInput(body.email || ""),
      message: sanitizeInput(body.message || ""),
    };

    // Validate form data
    const validation = validateContactForm(sanitizedData);

    if (!validation.valid) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // TODO: Here you would typically:
    // 1. Send an email to your email service
    // 2. Save to database
    // 3. Send confirmation email to user
    // For now, we'll just log it and return success

    console.log("Contact form submission:", {
      name: sanitizedData.name,
      email: sanitizedData.email,
      message: sanitizedData.message,
      timestamp: new Date().toISOString(),
      ip: clientIp,
    });

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully! I will get back to you soon.",
      },
      { status: 200 }
    );

    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Contact form error:", error);

    const response = NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );

    return addSecurityHeaders(response);
  }
}

// Handle unsupported methods
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Allow", "POST, OPTIONS");
  return addSecurityHeaders(response);
}
