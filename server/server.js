const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const wrapControllersWithRejectionProtection = require('./utils/wrapControllersWithRejectionProtection.js');
const AssetsController = require('./assets/AssetsController.js');
const http = require('http');
const { port } = require('./settings.json');

let app;
let server;

startServer();

function startServer() {
    app = express();
    app.use(bodyParser.json());
    app.use(express.static('assets/sound'));
    server = http.createServer(app);

    run();
    server.listen(port, () => {
        console.log(`\n\n --- Running on port ${port} ---`)
    });
}

function run() {
    const deps = {};
    const controllers = {
        assets: AssetsController(deps)
    };
    deps.controllers = controllers;

    const mappedControllers = wrapControllersWithRejectionProtection(controllers);
    setupRoutes(mappedControllers);
}

function setupRoutes(controllers) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client-dist', 'index.html'));
    });
    app.get('/index.js', (req, res) => {
        res.sendFile(path.join(__dirname, 'client-dist', 'index.js'));
    });

    app.get('/image/:imageName', controllers.assets.getImage);
    app.get('/sound/:soundName', controllers.assets.getSound);
}