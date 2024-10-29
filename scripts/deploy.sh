#!/bin/bash

ssh server << EOF
  cd /mnt/hdd/Skill-Forge
  git checkout main
  git pull
  pnpm install
  pnpm build
  pm2 restart 5
EOF
