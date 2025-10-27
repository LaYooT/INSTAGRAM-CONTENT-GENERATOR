-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isApproved_idx" ON "users"("isApproved");

-- CreateIndex
CREATE INDEX "content_jobs_userId_idx" ON "content_jobs"("userId");

-- CreateIndex
CREATE INDEX "content_jobs_createdAt_idx" ON "content_jobs"("createdAt");

-- CreateIndex
CREATE INDEX "content_jobs_userId_createdAt_idx" ON "content_jobs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "content_jobs_status_idx" ON "content_jobs"("status");

-- CreateIndex
CREATE INDEX "job_variations_jobId_idx" ON "job_variations"("jobId");

-- CreateIndex
CREATE INDEX "job_variations_isFavorite_idx" ON "job_variations"("isFavorite");
