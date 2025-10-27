# Testing Setup Guide

## Current Status
❌ **0% test coverage** - No tests implemented

This guide will help you set up testing infrastructure for the Instagram Content Generator project.

---

## Recommended Testing Stack

### Vitest (Test Runner)
- ✅ Fast and modern (Vite-powered)
- ✅ Compatible with Next.js 14
- ✅ Better DX than Jest
- ✅ Built-in TypeScript support

### Testing Library (UI Testing)
- ✅ Industry standard for React testing
- ✅ Encourages best practices
- ✅ Great documentation

---

## Step 1: Install Dependencies

```bash
# Core testing libraries
yarn add -D vitest @vitejs/plugin-react jsdom

# React testing utilities
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Additional utilities
yarn add -D @vitest/ui happy-dom
```

---

## Step 2: Create Vitest Configuration

Create `vitest.config.ts` at the root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '.next/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

---

## Step 3: Create Test Setup File

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: null,
      status: 'unauthenticated',
    };
  },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));
```

---

## Step 4: Create Mock Database

Create `tests/__mocks__/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});
```

Install mock utility:
```bash
yarn add -D vitest-mock-extended
```

---

## Step 5: Update package.json Scripts

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

## Step 6: Create Priority Tests

### Test #1: Password Validation (CRITICAL)

Create `tests/api/signup.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/signup/route';

describe('/api/signup', () => {
  it('should reject weak passwords', async () => {
    const request = new NextRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'weak', // Too short
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('8 characters');
  });

  it('should accept strong passwords', async () => {
    const request = new NextRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'StrongPass123!',
      }),
    });

    // Mock Prisma
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      // ... other fields
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### Test #2: Model Pricing (CRITICAL)

Create `tests/lib/fal.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { estimateCost } from '@/lib/fal';
import { prismaMock } from '../__mocks__/prisma';

describe('FAL.ai Pricing', () => {
  beforeEach(() => {
    // Mock model catalog pricing
    prismaMock.modelCatalog.findUnique.mockImplementation((args) => {
      const prices: Record<string, number> = {
        'fal-ai/flux/dev': 0.025,
        'fal-ai/luma-dream-machine': 0.05,
      };

      return Promise.resolve({
        id: '1',
        endpoint: args.where.endpoint,
        name: 'Test Model',
        category: 'image',
        provider: 'fal-ai',
        pricePerUnit: prices[args.where.endpoint] || 0,
        priceUnit: 'image',
        hasAudio: false,
        qualityRating: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        maxResolution: null,
        avgSpeed: null,
        description: null,
        features: null,
      });
    });
  });

  it('should calculate image cost correctly', async () => {
    const cost = await estimateCost({
      images: 10,
      imageModel: 'fal-ai/flux/dev',
    });

    expect(cost).toBe(0.25); // 10 * 0.025
  });

  it('should calculate video cost correctly', async () => {
    const cost = await estimateCost({
      videos: 5,
      videoModel: 'fal-ai/luma-dream-machine',
    });

    expect(cost).toBe(0.25); // 5 * 0.05
  });

  it('should use fallback pricing when model not found', async () => {
    prismaMock.modelCatalog.findUnique.mockResolvedValue(null);

    const cost = await estimateCost({
      images: 1,
      imageModel: 'unknown-model',
    });

    expect(cost).toBe(0.025); // Fallback price
  });
});
```

### Test #3: Budget Calculations

Create `tests/api/budget.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { GET, POST } from '@/app/api/budget/route';
import { NextRequest } from 'next/server';
import { prismaMock } from '../__mocks__/prisma';

describe('/api/budget', () => {
  it('should calculate remaining budget correctly', async () => {
    const mockSession = {
      user: { id: 'user1', email: 'test@example.com' },
    };

    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user1',
      manualBudget: 10.0, // $10 budget
      // ... other fields
    });

    prismaMock.contentJob.findMany.mockResolvedValue([
      { id: '1', cost: 2.5, userId: 'user1' },
      { id: '2', cost: 1.5, userId: 'user1' },
    ] as any);

    const request = new NextRequest('http://localhost:3000/api/budget');
    const response = await GET(request);
    const data = await response.json();

    expect(data.spent).toBe(4.0); // 2.5 + 1.5
    expect(data.remaining).toBe(6.0); // 10.0 - 4.0
    expect(data.hasManualBudget).toBe(true);
  });

  it('should reject negative budget values', async () => {
    const request = new NextRequest('http://localhost:3000/api/budget', {
      method: 'POST',
      body: JSON.stringify({ budget: -5 }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### Test #4: Authentication

Create `tests/lib/auth.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { authOptions } from '@/lib/auth';
import { prismaMock } from '../__mocks__/prisma';
import bcryptjs from 'bcryptjs';

describe('Authentication', () => {
  it('should reject unapproved users', async () => {
    const hashedPassword = await bcryptjs.hash('ValidPass123!', 12);

    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      isApproved: false, // Not approved
      role: 'USER',
      // ... other fields
    } as any);

    const credentials = {
      email: 'test@example.com',
      password: 'ValidPass123!',
    };

    const authorize = authOptions.providers[0].authorize!;

    await expect(
      authorize(credentials, {} as any)
    ).rejects.toThrow('pas encore été approuvé');
  });

  it('should allow approved users', async () => {
    const hashedPassword = await bcryptjs.hash('ValidPass123!', 12);

    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      isApproved: true, // Approved
      role: 'USER',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      // ... other fields
    } as any);

    const credentials = {
      email: 'test@example.com',
      password: 'ValidPass123!',
    };

    const authorize = authOptions.providers[0].authorize!;
    const user = await authorize(credentials, {} as any);

    expect(user).toBeTruthy();
    expect(user?.email).toBe('test@example.com');
  });
});
```

---

## Step 7: Create Test Workflow (CI/CD)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run tests
        run: yarn test:run

      - name: Generate coverage
        run: yarn test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Running Tests

```bash
# Run tests in watch mode (development)
yarn test

# Run tests once (CI)
yarn test:run

# Run with UI (interactive)
yarn test:ui

# Run with coverage report
yarn test:coverage
```

---

## Coverage Goals

### Phase 1 (Immediate - 4h)
- ✅ Critical business logic: 80%
  - Password validation
  - Pricing calculations
  - Budget calculations
  - Authentication

### Phase 2 (Week 1 - 8h)
- ✅ API routes: 60%
  - All POST/PUT/DELETE endpoints
  - Error handling paths

### Phase 3 (Week 2 - 12h)
- ✅ UI components: 40%
  - Forms
  - Critical user flows

### Phase 4 (Long term)
- ✅ Overall coverage: 70%+

---

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what the code does, not how
   - Don't test internal implementation details

2. **Use descriptive test names**
   - `it('should reject weak passwords')`
   - Not: `it('test1')`

3. **Follow AAA pattern**
   - Arrange: Setup test data
   - Act: Execute the code
   - Assert: Verify the result

4. **Mock external dependencies**
   - Database (Prisma)
   - External APIs (FAL.ai, AWS)
   - File system

5. **Test edge cases**
   - Empty inputs
   - Invalid data
   - Boundary conditions

---

## Next Steps

1. ✅ Install dependencies (`yarn add -D ...`)
2. ✅ Create config files
3. ✅ Create test setup
4. ✅ Write 4 critical tests (Priority #1-4)
5. ✅ Run tests and verify
6. ✅ Set up CI/CD pipeline
7. ✅ Iterate and improve coverage

**Estimated time:** 4-6 hours for basic setup + critical tests

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing/vitest)
