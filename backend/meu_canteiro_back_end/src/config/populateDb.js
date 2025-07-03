import Estrato from '../models/Estrato.js';
import Planta from '../models/Planta.js';
import { estratosData, plantasData } from './initData.js';

export async function populateDb() {
  // Popula Estratos se estiver vazio
  const estratoCount = await Estrato.count();
  if (estratoCount === 0) {
    for (const [nome_estrato, porcentagem_sombra] of Object.entries(estratosData)) {
      await Estrato.create({ nome_estrato, porcentagem_sombra });
    }
  }

  // Popula Plantas se estiver vazio
  const plantaCount = await Planta.count();
  if (plantaCount === 0) {
    for (const planta of plantasData) {
      await Planta.create(planta);
    }
  }
}