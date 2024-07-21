# lara.moe

## Installation

```bash
$ npm install

# doppler install
$ brew install gnupg
$ brew install dopplerhq/cli/doppler

# doppler login
$ doppler login

# doppler setup
$ doppler setup
```

## Running the app

필요 환경변수

```text
NXAPI_KEY : 넥슨 OPEN API KEY
DB_URL : MySQL URL
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
