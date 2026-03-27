FROM node:lts-bookworm-slim

# System dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    webp \
    curl \
    git \
    openssh-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /usr/src/app

# Force git to use HTTPS instead of SSH
RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/ && \
    git config --global url."https://github.com/".insteadOf git@github.com:

# Install dependencies first (layer caching)
COPY package.json ./
RUN npm install --legacy-peer-deps --omit=dev

# Copy source files
COPY . .

# Port (Railway uses $PORT, fallback to 7860)
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:7860/ || exit 1

CMD ["node", "index.js"]
