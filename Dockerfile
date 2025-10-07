FROM node:20-alpine AS builder

WORKDIR /app

# OpenSSL 설치 추가
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install && npm run db:build

COPY . .

RUN npm run build

FROM node:20-alpine

# 두 번째 스테이지에도 OpenSSL 설치 추가
RUN apk add --no-cache openssl curl

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
  echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
  apk add doppler

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm run db:deploy

CMD ["doppler", "run", "--", "npm", "run", "start"]
