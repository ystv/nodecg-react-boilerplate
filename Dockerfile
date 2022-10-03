# Use image based on Node.js 16 and an upgraded Express
FROM ghcr.io/ystv/nodecg:v1.9.0-ystv2 AS build
ENV CI=true
RUN apt-get update && apt-get install build-essential python3 -y

WORKDIR /usr/src/app/bundles/nodecg-react-boilerplate
COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

WORKDIR /usr/src/app
CMD ["node", "index.js"]
