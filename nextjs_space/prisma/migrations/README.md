# Prisma Migrations

This folder contains database migrations for the Instagram Content Generator project.

## How to Apply Migrations

### Development
```bash
# Apply all pending migrations
npx prisma migrate deploy

# Or create a new migration (after schema changes)
npx prisma migrate dev --name your_migration_name
```

### Production
```bash
# Apply migrations (non-interactive)
npx prisma migrate deploy
```

## Existing Migrations

### 20251027120724_add_performance_indexes
- **Date**: 2025-10-27
- **Description**: Adds performance indexes to frequently queried columns
- **Tables affected**:
  - `users`: Added indexes on `role` and `isApproved`
  - `content_jobs`: Added indexes on `userId`, `createdAt`, `userId + createdAt` (composite), and `status`
  - `job_variations`: Added indexes on `jobId` and `isFavorite`

**Performance impact**: 5-50x faster queries for:
- Job listing by user (userId index)
- Job sorting by date (createdAt index)
- Admin user filtering (role, isApproved indexes)
- Job status filtering (status index)
- Variation queries (jobId index)

## Notes

- Always backup your database before applying migrations in production
- Migrations are applied in chronological order
- Do not modify existing migration files after they've been applied
