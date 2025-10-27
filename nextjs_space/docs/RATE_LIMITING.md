# Rate Limiting Implementation

## Current Implementation

The project uses a **simple in-memory rate limiting** middleware (`middleware.ts`) that protects:

- `/api/signup` - 5 requests per 15 minutes
- `/api/auth/*` - 10 requests per 15 minutes
- `/api/upload` - 20 requests per minute

### Limitations of In-Memory Rate Limiting

⚠️ **Current implementation has these limitations:**

1. **Resets on server restart** - Counters are lost when the app restarts
2. **Not suitable for multi-instance deployments** - Each server instance has its own counters
3. **Memory usage** - Stores all client IPs in memory (cleaned up every minute)

### When In-Memory is Acceptable

✅ Good for:
- Development environments
- Single-server deployments
- Low-traffic applications (< 1000 req/min)
- Quick protection against basic abuse

---

## Production-Ready Solution: Redis-Based Rate Limiting

For production deployments, upgrade to **Redis-based rate limiting** using Upstash.

### Step 1: Install Dependencies

```bash
yarn add @upstash/ratelimit @upstash/redis
```

### Step 2: Setup Upstash Redis

1. Create free account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and token
4. Add to `.env`:

```bash
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### Step 3: Create Rate Limiting Utility

Create `lib/rate-limit.ts`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Signup rate limiter: 5 requests per 15 minutes
export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "@ratelimit/signup",
});

// Auth rate limiter: 10 requests per 15 minutes
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
  prefix: "@ratelimit/auth",
});

// Upload rate limiter: 20 requests per minute
export const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "@ratelimit/upload",
});
```

### Step 4: Update Middleware

Replace `middleware.ts` with:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signupLimiter, authLimiter, uploadLimiter } from '@/lib/rate-limit';

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientId = getClientId(request);

  let limiter;
  if (pathname.startsWith('/api/signup')) {
    limiter = signupLimiter;
  } else if (pathname.startsWith('/api/auth')) {
    limiter = authLimiter;
  } else if (pathname.startsWith('/api/upload')) {
    limiter = uploadLimiter;
  } else {
    return NextResponse.next();
  }

  const { success, limit, reset, remaining } = await limiter.limit(clientId);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        limit,
        remaining: 0,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

export const config = {
  matcher: [
    '/api/signup/:path*',
    '/api/auth/:path*',
    '/api/upload/:path*',
  ],
};
```

### Step 5: Test Rate Limiting

```bash
# Test signup endpoint (should block after 5 requests)
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test123!"}' \
    -v
done

# Check headers in response:
# X-RateLimit-Limit: 5
# X-RateLimit-Remaining: 0
# X-RateLimit-Reset: 1234567890
```

---

## Alternative: API Route-Level Rate Limiting

If you prefer route-level control, you can apply rate limiting directly in API routes:

```typescript
// app/api/signup/route.ts
import { signupLimiter } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const { success } = await signupLimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Try again later.' },
      { status: 429 }
    );
  }

  // Continue with signup logic...
}
```

---

## Monitoring Rate Limits

### Upstash Dashboard
- View rate limit analytics in Upstash dashboard
- See top offenders, request patterns, etc.

### Custom Logging
Add logging to track rate limit hits:

```typescript
if (!success) {
  console.warn(`Rate limit exceeded for ${clientId} on ${pathname}`);
  // Optional: Send to monitoring service (Sentry, DataDog, etc.)
}
```

---

## Best Practices

1. **Different limits for different endpoints**
   - Public endpoints: Strict limits (5-10 req/15min)
   - Authenticated endpoints: Relaxed limits (100 req/min)

2. **Graceful degradation**
   - If Redis is down, fail open (allow requests)
   - Log failures for monitoring

3. **IP-based + User-based limiting**
   - Combine IP limiting with user ID limiting
   - Prevents bypass via multiple IPs

4. **Clear error messages**
   - Include `Retry-After` header
   - Provide friendly error messages

5. **Test thoroughly**
   - Simulate attack scenarios
   - Verify limits work as expected

---

## Current Status

✅ **Basic rate limiting implemented** (in-memory)
⚠️ **Production upgrade recommended** (Redis-based)

**Next steps:**
1. Setup Upstash Redis account
2. Install @upstash packages
3. Replace middleware with Redis implementation
4. Test in staging environment
5. Deploy to production

**Estimated time:** 1-2 hours
