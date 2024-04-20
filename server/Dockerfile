FROM oven/bun:1.1.4-slim

WORKDIR /code

COPY bun.lockb .
COPY package.json .

RUN apt update && apt install -y netcat
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000/tcp

RUN chmod +x runner.sh
RUN chmod +x scripts.sh

ENTRYPOINT ["./runner.sh"]
