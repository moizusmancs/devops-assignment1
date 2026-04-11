#!/bin/sh
set -e

echo "Running database schema setup..."
node src/config/setup.js

echo "Starting application..."
exec node src/index.js
