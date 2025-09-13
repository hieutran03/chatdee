#!/bin/bash

if [ -z "$1" ]; then
  echo "Thiếu tên migration."
  echo "Usage: ./migration-gen.sh create_table_users"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

MIGRATION_NAME=$1

yarn migrate:generate:dev  "$ROOT_DIR/backend/src/migrations/$MIGRATION_NAME"