#!/usr/bin/env node
'use strict';
const app = require('express')();
const fastify = require('fastify')({
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.cert'))
  }
})
const processRequest = require('./src/proxy.js'); // Import the named export
const PORT = process.env.PORT || 8080;

fastify.get('/', processRequest);
fastify.listen({host: '0.0.0.0', port: PORT });
