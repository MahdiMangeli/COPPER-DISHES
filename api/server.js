const { json } = require('body-parser');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
server.use(json());
server.use(middlewares);
server.use(router);
module.exports = server;