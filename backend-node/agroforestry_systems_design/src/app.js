import express from 'express';
import cors from 'cors';
import canteiroRoutes from './routes/canteiro.js';
import sequelize from './config/db.js';
import { populateDb } from './config/populateDb.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', canteiroRoutes);

sequelize.sync().then(async () => {
  console.log('Banco de dados sincronizado');
  await populateDb();
  app.listen(5002, () => {
    console.log('API Agroforestry rodando em http://localhost:5002');
    console.log('Swagger disponível em http://localhost:5002/api-docs');
  });
});

export default app;