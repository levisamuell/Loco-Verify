FROM node:20-slim

# Install OpenSSL + CA certificates
RUN apt-get update && apt-get install -y openssl ca-certificates && update-ca-certificates

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies for the client
RUN cd client && npm ci

# Copy Prisma schema into client directory
RUN mkdir -p client/prisma && cp -r prisma/* client/prisma/

# Generate Prisma client INSIDE /app/client
RUN cd client && npx prisma generate --schema=./prisma/schema.prisma

# Build the Next.js app
WORKDIR /app/client
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
