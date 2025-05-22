import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import plantasRoutes from './routes/planta.js';
import canteiroRoutes from './routes/canteiro.js';
import sequelize from './config/db.js';
import { populateDb } from './config/populateDb.js';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Use only one route for plantas
app.use('/plantas', plantasRoutes);
app.use('/canteiro', canteiroRoutes);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

sequelize.sync({ force: true }).then(async () => {
  console.log('Banco de dados sincronizado');
  await populateDb();
  console.log('Dados iniciais inseridos');
  
  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  }
}).catch(error => {
  console.error('Erro ao sincronizar banco:', error);
});

export default app;