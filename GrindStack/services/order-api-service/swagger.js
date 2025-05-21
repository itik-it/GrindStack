const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Order API',
    version: '1.0.0',
    description: 'API for placing orders'
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

module.exports = swaggerJSDoc(options);