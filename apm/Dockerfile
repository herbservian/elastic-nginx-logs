FROM node:latest

COPY main.js src/main.js
COPY package.json src/package.json

WORKDIR src

ENV ELASTIC_APM_PAYLOAD_LOG_FILE=/tmp/payload.ndjson

RUN yarn install

COPY start.sh start.sh

ENTRYPOINT ["sh", "start.sh"]