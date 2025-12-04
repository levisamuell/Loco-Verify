import { NextResponse } from "next/server";
import { logger } from "./logger";

interface AppError extends Error {
  name: string;
  message: string;
  stack?: string;
  details?: unknown;
}

export function handleError(error: unknown, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  // Determine the appropriate status code
  let statusCode = 500;
  let errorMessage = "Unknown error occurred";

  if (error instanceof Error) {
    errorMessage = error.message;

    // Handle different error types
    if (error.name === "ValidationError") {
      statusCode = 400;
    } else if (error.name === "NotFoundError") {
      statusCode = 404;
    } else if (error.name === "UnauthorizedError") {
      statusCode = 401;
    }
  }

  // Construct the error response
  const errorResponse: {
    success: boolean;
    message: string;
    stack?: string;
    details?: unknown;
  } = {
    success: false,
    message: isProd ? getProductionMessage(statusCode) : errorMessage,
  };

  // Include stack trace only in development
  if (!isProd && error instanceof Error && error.stack) {
    errorResponse.stack = error.stack;
  }

  // Include additional error details in development
  if (!isProd && error instanceof Error && (error as AppError).details) {
    errorResponse.details = (error as AppError).details;
  }

  // Log the error with structured data
  logger.error(`Error in ${context}`, {
    message: errorMessage,
    statusCode: statusCode,
    stack: isProd
      ? "REDACTED"
      : error instanceof Error
        ? error.stack
        : "No stack",
    context: context,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}

// Helper function to get user-friendly production messages
function getProductionMessage(statusCode: number): string {
  const messages: { [key: number]: string } = {
    400: "Invalid request. Please check your input.",
    401: "Authentication required. Please log in.",
    403: "You don't have permission to access this resource.",
    404: "The requested resource was not found.",
    500: "Something went wrong. Please try again later.",
    503: "Service temporarily unavailable. Please try again later.",
  };

  return (
    messages[statusCode] || "Something went wrong. Please try again later."
  );
}
