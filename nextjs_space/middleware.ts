import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiting
 * For production, consider using Redis-based rate limiting (Upstash, etc.)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMITS = {
  '/api/signup': { max: 5, windowMs: 15 * 60 * 1000 }, // 5 signups per 15 min
  '/api/auth': { max: 10, windowMs: 15 * 60 * 1000 },   // 10 auth attempts per 15 min
  '/api/upload': { max: 20, windowMs: 60 * 1000 },      // 20 uploads per minute
} as const;

/**
 * Get client identifier (IP address or fallback)
 */
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return ip;
}

/**
 * Check if request should be rate limited
 */
function shouldRateLimit(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;

  // Find matching rate limit config
  const limitConfig = Object.entries(RATE_LIMITS).find(([path]) =>
    pathname.startsWith(path)
  );

  if (!limitConfig) {
    return false; // No rate limit for this path
  }

  const [, { max, windowMs }] = limitConfig;
  const clientId = getClientId(request);
  const key = `${pathname}:${clientId}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= max) {
    // Rate limit exceeded
    return true;
  }

  // Increment counter
  entry.count++;
  return false;
}

/**
 * Cleanup expired entries periodically
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000); // Cleanup every minute
}

export function middleware(request: NextRequest) {
  // Skip rate limiting for authenticated API routes (already have auth checks)
  const pathname = request.nextUrl.pathname;

  // Only rate limit specific public endpoints
  const shouldCheck = pathname.startsWith('/api/signup') ||
                      pathname.startsWith('/api/auth') ||
                      pathname.startsWith('/api/upload');

  if (!shouldCheck) {
    return NextResponse.next();
  }

  // Check rate limit
  if (shouldRateLimit(request)) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: '15 minutes'
      },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/signup/:path*',
    '/api/auth/:path*',
    '/api/upload/:path*',
  ],
};
