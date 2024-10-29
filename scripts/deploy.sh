#!/bin/bash

ssh server << EOF
  cd /mnt/hdd/Skill-Forge
  git checkout main
  git pull
  pnpm build-containers
  pnpm install
  pnpm build
  pm2 restart all
EOF
