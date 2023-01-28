#!/bin/bash
source .env
if [ "$NEXT_PUBLIC_FILES_ENABLED" = "true" ]; then
    echo "Creating files..."
    mkdir -p public/files
    cd public/files
    fallocate -l 100M 100M.file
    fallocate -l 1G 1G.file
    fallocate -l 5G 5G.file
    fallocate -l 10G 10G.file
fi

