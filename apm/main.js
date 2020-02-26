const faker = require('faker');
const moment = require('moment');
const fs = require('fs');

// Add this to the VERY top of the first file loaded in your app
const apm = require('elastic-apm-node').start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: 'nodeapmdemoapp',

  // Use if APM Server requires a token
  secretToken: 'false',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'false'
})

// North Korea IP Address Range
// 175.45.176.0 – 175.45.179.255

// MITRE ATT&CK
// Destination Port: 22 (SSH (Secure Shell) from the Internet)
// Destination Port: 8000 (TCP Port 8000 Activity to the Internet)
// Destination Port: 9001 or 9030 ()


const verbose = process.env.NODE_VERBOSE || false;

const generateLoad = () => {
  let result = 0;
  let shouldRun = 0;
  while(shouldRun < 100000) {
    result += Math.random() * Math.random();
    shouldRun++;
  }

  return result;
}

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

const mitreSshFromInternet = () => {
  const sshAccess = faker.fake(`${nkIpAddress()} - - [${timestamp()}] "GET /{{internet.domainWord}}/{{lorem.slug}} HTTP/1.1" ${httpStatusCode()} {{random.number}} "-" "{{internet.userAgent}}"`);
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
  
  generateLoad();

  lastUpdate = now;
  duration = duration + dt;
}