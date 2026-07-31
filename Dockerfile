FROM node:25-alpine AS deps
WORKDIR /app
RUN npm install -g npm@11.19.0
COPY package*.json ./
RUN npm ci

FROM node:25-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:25-alpine AS prod-deps
WORKDIR /app
RUN npm install -g npm@11.19.0
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:25-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g npm@11.19.0
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:5000/health || exit 1
CMD ["node", "dist/main"]
