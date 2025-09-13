#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

pushd "$ROOT_DIR/provision" > /dev/null
docker compose -f docker-compose.provider.yml down
popd > /dev/null