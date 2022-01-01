const http = require('http');
const https = require('https');
const fs = require('fs');
const privateKey= fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');
const app = require('./backend/app')
const server = https.createServer({key:privateKey,cert:certificate},app);
server.listen(process.env.PORT||3000);