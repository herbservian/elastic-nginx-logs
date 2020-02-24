FROM node:latest

COPY main.js src/main.js
COPY package.json src/package.json

WORKDIR src

RUN yarn install

RUN wget -nc https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.6.0-linux-x86_64.tar.gz
RUN tar -zxf filebeat-7.6.0-linux-x86_64.tar.gz && mv filebeat-7.6.0-linux-x86_64 filebeat
RUN rm filebeat-7.6.0-linux-x86_64.tar.gz

COPY filebeat.yml filebeat/filebeat.yml
COPY start.sh start.sh

ENTRYPOINT ["sh", "start.sh"]