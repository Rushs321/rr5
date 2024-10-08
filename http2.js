#!/usr/bin/env node
'use strict';
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork()
    });
} else {
    const PORT = process.env.PORT || 8080;
    const app = require('./dd.js');
    const spdy = require('spdy');
    const fs = require('fs');


    // Turn on SSL if possible, but run http2c if not.
    // http2c makes if SSL is offloaded.
    const keyPath = './cert/privkey.pem';
    const certPath = './cert/fullchain.pem';
    let ssl = false;
    let plain = true;
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        ssl = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        };
        plain = false;
    }

    const options = {

        // **optional** SPDY-specific options
        spdy: {
            protocols: ['h2', 'spdy/3.1', 'http/1.1'],
            ssl: ssl,
            plain: plain,
            connection: {
                windowSize: 1024 * 1024, // Server's window size
                // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
                // helpful for best performance behind SSL offload.
                autoSpdy31: true
            }
        }
    };

    spdy.createServer(options, app).listen(PORT, () => console.log(`Listening on ${PORT}`));
}
