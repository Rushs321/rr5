#!/usr/bin/env node
'use strict';
const processRequest = require('./src/proxy.js'); // Import the named export
const PORT = process.env.PORT || 8080;
const keyPath = './cert/privkey.pem';
const certPath = './cert/fullchain.pem';
const fastify = require('fastify')({
  http2: true,
  https: {
    allowHTTP1: true,
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }
})


fastify.get('/', processRequest);
fastify.listen({host: '0.0.0.0', port: PORT });
