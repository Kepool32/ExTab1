FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY config ./config
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config/wait-for-db.js ./config/wait-for-db.js
COPY --from=builder /app/config/create-db.js ./config/create-db.js
COPY --from=builder /app/config/init.sql ./config/init.sql
COPY --from=builder /app/config/start.js ./config/start.js
COPY tsconfig.json ./

EXPOSE 3001

CMD ["sh", "-c", "node config/wait-for-db.js && node config/create-db.js && node config/start.js"]
