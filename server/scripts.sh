#!/bin/bash
set -e

docker_build() {
  docker build -t ahmedsadman/mentorship-server .
}

docker_push() {
  docker push ahmedsadman/mentorship-server
}

build_push() {
  docker_build
  docker_push
}

dev_start() {
  docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
}

dev_down() {
  docker compose -f docker-compose.yml -f docker-compose.dev.yml down
}

lint() {
  echo Running Lint
  bun run lint-nofix
}

test() {
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    echo "Waiting for DB to be available... (Host=$DB_HOST, Port=$DB_PORT)"
    sleep 2
  done
  bun run test
}

main() {
    # Check if a function name was provided as an argument
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <function_name>"
        exit 1
    fi

    # Check if the provided function exists
    if [ "$(type -t "$1")" = 'function' ]; then
        # Execute the provided function
        "$@"
    else
        echo "Function $1 doesn't exist."
        exit 1
    fi
}

main "$@"
