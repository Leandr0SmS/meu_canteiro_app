import express from 'express';
import cors from 'cors';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import plantasRoutes from './routes/planta.js';
import canteiroRoutes from './routes/canteiro.js';
import sequelize from './config/db.js';
import { populateDb } from './config/populateDb.js';

const app = express();
const upload = multer();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(upload.none()); // For parsing multipart/form-data

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', plantasRoutes);
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