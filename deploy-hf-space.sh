#!/bin/bash
set -e
# Deploy night-moves to Hugging Face Spaces
# Usage: bash deploy-hf-space.sh

REPO_ID="XMRTDAO/night-moves"
HF_SPACE="https://huggingface.co/spaces/${REPO_ID}"

echo "Checking HF Space quota..."
# If quota exceeded, this will fail — free up old Spaces first
curl -sL "${HF_SPACE}" | head -10

echo "Pushing to HF Space..."
if [ ! -d ".git" ]; then
  echo "Error: must run from git repo root"
  exit 1
fi

# Install huggingface_hub if needed
pip install -q huggingface-hub 2>/dev/null || true

# Push via huggingface_hub
git remote get-url hf-space >/dev/null 2>&1 ||   git remote add hf-space "https://huggingface.co/spaces/${REPO_ID}.git"

git push hf-space main --force

echo "Done. Visit ${HF_SPACE}"
