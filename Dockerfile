FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY tsconfig.json ./

COPY src ./src

RUN yarn build

FROM node:25-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production

EXPOSE 4500

CMD ["node", "dist/index.js"]
