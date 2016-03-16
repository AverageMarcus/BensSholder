'use strict';
const Hapi = require('hapi');
const ImageHelper = require('./image');

let imageHelper = new ImageHelper();

const server = new Hapi.Server();
server.connection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5000
});

server.route([
  {
    method: 'GET',
    path:'/',
    handler: function (req, reply) {
      return reply(``);
    }
  },
  {
    method: 'GET',
    path:'/{x}/{y}',
    handler: function (req, reply) {
      imageHelper.getImage(req.params.x, req.params.y)
        .then((buffer) => {
          return reply(buffer).type('image/png');
        })
        .catch(() => {
          return reply('Unable to get image').code(404);
        });
    }
  }
]);

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});