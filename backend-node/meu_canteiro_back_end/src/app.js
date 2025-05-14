import express from 'express';
import cors from 'cors';
import plantasRoutes from './routes/plantas.js';
import canteiroRoutes from './routes/canteiro.js';
import sequelize from './config/db.js';
import { populateDb } from './config/populateDb.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/planta', plantasRoutes);
app.use('/canteiro', canteiroRoutes);

app.get('/', (req, res) => {
  res.redirect('/openapi'); // ajuste conforme documentação
});

sequelize.sync().then(async () => {
  await populateDb();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
});