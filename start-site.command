#!/bin/bash
# Double-click to run the Strand site locally. Close this window to stop it.
cd "$(dirname "$0")"
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is required — install it from https://nodejs.org (LTS), then double-click this again."
  read -r -p "Press Enter to close." ; exit 1
fi
[ -d node_modules ] || npm install
( sleep 6; open "http://localhost:3000" ) &
npm run dev
