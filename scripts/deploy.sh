#!/bin/bash

# Load environment variables from .env file
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

dotEnvFileContents=$(cat .env)
database_url=$(echo $dotEnvFileContents | grep -oP 'DATABASE_URL=\K.*')
admin_database_url=$(echo $dotEnvFileContents | grep -oP 'ADMIN_DATABASE_URL=\K.*')

ssh server << EOF
  cd /mnt/hdd/Skill-Forge
  git checkout main
  git pull
  echo "$dotEnvFileContents" > .env
  DATABASE_URL=$admin_database_url
  pnpm db:push
  DATABASE_URL=$database_url
  pnpm install
  pnpm build
  pm2 restart all
EOF
