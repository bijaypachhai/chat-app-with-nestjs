FROM node:22.11-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install --frozen-lockfile

COPY eslint.config.mjs nest-cli.json tsconfig.build.json tsconfig.json .

COPY src ./src

RUN npm build

FROM node:22.11-alpine

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist/

EXPOSE 3000

CMD ["node", "dist/main.js"]