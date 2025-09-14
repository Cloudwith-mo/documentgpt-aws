#!/usr/bin/env bash
set -euo pipefail
mkdir -p dist/chat-lambda
pnpm --filter @docgpt/chat-lambda build
(cd services/ingest && zip -r ../../dist/ingest.zip handler.py requirements.txt)
echo "Artifacts in dist/: chat-lambda.zip, ingest.zip"
