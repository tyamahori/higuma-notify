FROM oven/bun:1.2

ENV TZ Asia/Tokyo

RUN apt-get update && apt-get install -y bash curl

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json bun.lock ./

# Install dependencies first
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

EXPOSE 8787

CMD ["bun", "dev"]