'use strict';
const Hapi = require('hapi');
const ImageHelper = require('./image');

let imageHelper = new ImageHelper();

const server = new Hapi.Server();
server.connection({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 5000
});

server.register(require('inert'), (err) => {

  if (err) {
      throw err;
  }

  server.route([
    {
      method: 'GET',
      path:'/',
      handler: function (req, reply) {
        reply.file(`public/index.html`);
      }
    },
    {
      method: 'GET',
      path:'/{file}',
      handler: function (req, reply) {
        reply.file(`public/${req.params.file}`);
      }
    },
    {
      method: 'GET',
      path:'/{x}/{y}',
      handler: function (req, reply) {

        imageHelper.getImage(req.params.x, req.params.y)
          .then((buffer) => {
            return reply(buffer).type('image/png').header('Access-Control-Allow-Origin', '*');
          })
          .catch(() => {
            return reply('Unable to get image').code(404);
          });
      }
    },
    {
      method: 'GET',
      path:'/face',
      handler: function (req, reply) {

        imageHelper.getFace()
          .then((buffer) => {
            return reply(buffer).type('image/png').header('Access-Control-Allow-Origin', '*');
          })
          .catch(() => {
            return reply('Unable to get image').code(404);
          });
      }
    }
  ]);

});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});