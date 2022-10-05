#!/bin/sh

echo "Stating app..."

npm run build
NODE_ENV=production npm run start
