const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online Learning Platform API',
      version: '1.0.0',
      description: 'API documentation for the Online Learning Platform',
    },
    servers: [
      {
        url: 'http://localhost:3001', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your API docs
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };
