#!/bin/sh

# Commands to execute when starting LinkLeopard Docker container

# Execute database migrations
pnpm run db:push

# Run Node.js application
pnpm run start
