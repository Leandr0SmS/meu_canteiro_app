import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agroforestry Systems Design API',
      version: '1.0.0',
      description: 'API for managing agroforestry beds (canteiros)',
    },
    servers: [
      {
        url: 'http://localhost:5002',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const specs = swaggerJSDoc(options);