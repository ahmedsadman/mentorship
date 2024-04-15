#!/bin/bash

set -e

local_up() {
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
}

local_down() {
    docker-compose -f docker-compose.yml -f docker-compose.override.yml down
}

test_server() {
    cd server && docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from server
    cd ../
}

lint_server() {
    cd server && docker build -t lint-image . && docker run --entrypoint "./scripts.sh" --rm lint-image lint
    cd ../
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
