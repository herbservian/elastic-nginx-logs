const faker = require('faker');
const moment = require('moment');
const fs = require('fs');

// North Korea IP Address Range
// 175.45.176.0 – 175.45.179.255

// MITRE ATT&CK
// Destination Port: 22 (SSH (Secure Shell) from the Internet)
// Destination Port: 8000 (TCP Port 8000 Activity to the Internet)
// Destination Port: 9001 or 9030 ()


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

// @see https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/log-format/

// [18/Nov/2019:10:08:15 -0700] <request IP> - - - <config host> <request host> to: 127.0.0.1:8000: GET /path/requested HTTP/1.1 200 upstream_response_time 0.000 msec 1574096895.474 request_time 0.001
// 192.168.1.4 - {{name.firstName}} [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" 200 {{random.number}}
// "http://{{internet.domainWord}}/{{internet.domainWord}}" "{{internet.userAgent}}" {{random.number}} {{random.number}} [upstream] [upstream] ${nkIpAddress()}
// {{random.number}} {{random.number}} 200 {{random.number}}
const mitreSshFromInternet = () => {
  // const sshAccess = faker.fake(`[${timestamp()}] ${nkIpAddress()} - - - {{internet.domainName}} {{internet.domainName}} to: 127.0.0.1:8000 "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" ${httpStatusCode()} upstream_response_time  {{random.number}}.000 msec "-" "{{internet.userAgent}}"`);
  // const sshAccess = faker.fake(`${nkIpAddress()} - - [${timestamp()}] http {{internet.domainName}} 172.0.0.80:8080 "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" 200 {{random.number}} "-" "{{internet.userAgent}}"`);
  const sshAccess = faker.fake(
      `192.168.1.4:8000 - {{name.firstName}} [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" 200 {{random.number}} ` +
      `"http://{{internet.domainWord}}/{{internet.domainWord}}" "{{internet.userAgent}}" {{random.number}} {{random.number}} [upstream] [upstream] ${nkIpAddress()} ` +
      `{{random.number}} {{random.number}} ${httpStatusCode()} {{random.number}}`
  );
  
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

console.log(`Starting log generation with an attack starting between ${start / 1000} - ${(start + range)/1000} seconds`);
console.log(`Environment verbose is set to ${verbose}`);

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
  
  // if (duration >= attackStartTime) {
  //   if (attackLastWrite >= attackLogInterval()) {
  //     // attackLog();
  //     mitreSshFromInternet();
  //     attackLastWrite = 0;
  //   }
  // }
  
  lastUpdate = now;
  duration = duration + dt;
}