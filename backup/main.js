const faker = require('faker');
const moment = require('moment');
const fs = require('fs');

// North Korea IP Address Range
// 175.45.176.0 – 175.45.179.255

// ** MITRE ATT&CK **

// Destination Port: 22 (SSH (Secure Shell) from the Internet)
// network.transport: tcp and destination.port: 22 and (
// network.direction: outbound or ( source.ip: (10.0.0.0/8 or
// 172.16.0.0/12 or 192.168.0.0/16) and not destination.ip:
// (10.0.0.0/8 or 172.16.0.0/12 or 192.168.0.0/16) ) )

// Destination Port: 8000 (TCP Port 8000 Activity to the Internet)
// network.transport: tcp and destination.port: 8000 and (
// network.direction: outbound or ( source.ip: (10.0.0.0/8 or
// 172.16.0.0/12 or 192.168.0.0/16) and not destination.ip:
// (10.0.0.0/8 or 172.16.0.0/12 or 192.168.0.0/16) ) )

// Destination Port: 9001 or 9030 (TOR)
// network.transport: tcp and destination.port: 9001 OR 9030 and (
// network.direction: outbound or ( source.ip: (10.0.0.0/8 or
// 172.16.0.0/12 or 192.168.0.0/16) and not destination.ip:
// (10.0.0.0/8 or 172.16.0.0/12 or 192.168.0.0/16) ) )


const verbose = process.env.NODE_VERBOSE || false;

const nkIpAddress = () => {
  return `175.45.${(Math.floor(Math.random() * 3) + 176)}.${(Math.floor(Math.random() * 255))}`
};

const httpStatusCode = () => {
  return `${(Math.floor(Math.random() * 500) + 200)}` // Generates random number between 200 & 500
};

const stream = () => {
  return fs.createWriteStream('./access.log', {
    flags: 'a'
  });
};

// const regularNginxLog = () => {
//   const access = faker.fake(`{{internet.ip}} - - [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" 200 {{random.number}} "-" "{{internet.userAgent}}"`);
//   verbose && console.log(access);
//   stream().write(`${access}\n`);
// };

// const attackLog = () => {
//   const access = faker.fake(`${nkIpAddress()} - - [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" ${httpStatusCode()} {{random.number}} "-" "{{internet.userAgent}}"`);
//   verbose && console.log(access);
//   stream().write(`${access}\n`);
// };

// [18/Nov/2019:10:08:15 -0700] <request IP> - - - <config host> <request host> to: 127.0.0.1:8000: GET /path/requested HTTP/1.1 200 upstream_response_time 0.000 msec 1574096895.474 request_time 0.001
const mitreSshFromInternet = () => {
  // const sshAccess = faker.fake(`[${timestamp()}] ${nkIpAddress()} - - - {{internet.domainName}} {{internet.domainName}} to: 127.0.0.1:8000 "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" ${httpStatusCode()} upstream_response_time  {{random.number}}.000 msec "-" "{{internet.userAgent}}"`);
  const sshAccess = faker.fake(`${nkIpAddress()} - - [${timestamp()}] http {{internet.domainName}} 172.0.0.80:8080 "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" 200 {{random.number}} "-" "{{internet.userAgent}}"`);
  // const sshAccess = faker.fake(`${nkIpAddress()} - - [${timestamp()}] http {{internet.domainName}} 172.0.0.80:8080, 172.0.1.80:8080 "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" ${httpStatusCode()} {{random.number}} "-" "{{internet.userAgent}}"`);
  verbose && console.log(sshAccess);
  stream().write(`${sshAccess}\n`);
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
    // regularNginxLog();
    mitreSshFromInternet();
    regularLastWrite = 0;
  }
  
  if (duration >= attackStartTime) {
    if (attackLastWrite >= attackLogInterval()) {
      // attackLog();
      mitreSshFromInternet();
      attackLastWrite = 0;
    }
  }
  
  lastUpdate = now;
  duration = duration + dt;
}