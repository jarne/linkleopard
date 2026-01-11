#!/bin/sh

# Commands to execute when starting LinkLeopard Docker container

# Build Next.js application
# this is required for using environment variables set at runtime
pnpm run build

# Execute database migrations
pnpm run db:push

# Run Node.js application
pnpm run start
