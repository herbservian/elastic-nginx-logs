const faker = require('faker');
const moment = require('moment');
const fs = require('fs');

// 175.45.176.0 – 175.45.179.255

const verbose = process.env.NODE_VERBOSE || false;

const nkIpAddress = () => {
  return `175.45.${(Math.floor(Math.random() * 3) + 176)}.${(Math.floor(Math.random() * 255))}`
};

const httpStatusCode = () => {
  return `${(Math.floor(Math.random() * 500) + 200)}`
};

const stream = () => {
  return fs.createWriteStream('./access.log', {
    flags: 'a'
  });
};

const regularNginxLog = () => {
  const access = faker.fake(`{{internet.ip}} - - [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" 200 {{random.number}} "-" "{{internet.userAgent}}"`);
  verbose && console.log(access);
  stream().write(`${access}\n`);
};

const attackLog = () => {
  const access = faker.fake(`${nkIpAddress()} - - [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" ${httpStatusCode()} {{random.number}} "-" "{{internet.userAgent}}"`);
  verbose && console.log(access);
  stream().write(`${access}\n`);
};


const timestamp = () => {
  const ts = faker.date.recent(7);
  return moment(ts).format('DD/MMM/YYYY:HH:mm:ss ZZ');
};

const range = parseInt(process.env.RANGE) || 60000;
const start = parseInt(process.env.START) || 60000;

const regularLogInterval = () => (Math.floor(Math.random() * 800) + 800); // 800 - 1200 ms
const attackLogInterval = () => (Math.floor(Math.random() * 150) + 200); // 200 - 250 ms
const attackStartTime = (Math.floor(Math.random() * range) + start); // between 2 and 3 minutes

console.log(`Starting log generation with an attack starting between ${start / 1000} - ${(start + range)/1000} seconds`)

let duration = 0;
let lastUpdate = Date.now();
let regularLastWrite = Date.now();
let attackLastWrite = Date.now();
const myInterval = setInterval(tick, 0);

function tick() {
  const now = moment.now();
  const dt = now - lastUpdate;
  regularLastWrite = regularLastWrite + dt;
  attackLastWrite = attackLastWrite + dt;
  
  if (regularLastWrite >= regularLogInterval()) {
    regularNginxLog();
    regularLastWrite = 0;
  }
  
  if (duration >= attackStartTime) {
    if (attackLastWrite >= attackLogInterval()) {
      attackLog();
      attackLastWrite = 0;
    }
  }
  
  lastUpdate = now;
  duration = duration + dt;
}