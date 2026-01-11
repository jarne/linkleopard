# docker container build file
# for: LinkLeopard
# created in: 2025 by: @jarne

# Begin with Node.js LTS container image
FROM node:24

# Default value for database file in Docker container
ENV DB_FILE_NAME=file:/data/db/local.db

# Enable Pnpm
RUN corepack enable pnpm

# Create and switch to app source folder
WORKDIR /app

# Gain permissions to the app user for the created source folder
RUN chown node:node /app

# Add app source code and set permissions to application user
COPY --chown=node:node ./ ./

# Create data folder for database
RUN mkdir -p /data/db && chown -R node:node /data

# Switch to non-root user
USER node

# Switch to app source folder
WORKDIR /app

# Install dependecies
RUN CI=true pnpm install --frozen-lockfile

# Build Next.js application
RUN pnpm run build

# Run startup commands
CMD ["/bin/sh", "docker-cmd.sh"]

# Open application ports
EXPOSE 3000
