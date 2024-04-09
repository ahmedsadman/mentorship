FROM oven/bun:1.0.29-slim

WORKDIR /code

COPY bun.lockb .
COPY package.json .

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000/tcp

ENTRYPOINT ["bun", "run", "src/index.ts"]
