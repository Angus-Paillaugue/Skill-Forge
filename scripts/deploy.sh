#!/bin/bash

# Load environment variables from .env file
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

dotEnvFileContents=$(cat .env)

ssh server << EOF
  cd /mnt/hdd/Skill-Forge
  git checkout main
  git pull
  echo "$dotEnvFileContents" > .env
  mysql -u $ADMIN_USER_USERNAME -p$ADMIN_USER_PASSWORD skillforge < migrate.sql
  pnpm install
  pnpm build-containers
  pnpm build
  pm2 restart all
EOF
