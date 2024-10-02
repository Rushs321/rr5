const fastify = require('fastify')();
const express = require('@fastify/express');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 3000;


  // Register the express plugin
 fastify.register(express);

  // Use Express middleware for handling the proxy
// Set up the route
fastify.get('/', async (request, reply) => {
  return processRequest(request, reply);
});

module.exports= fastify;
