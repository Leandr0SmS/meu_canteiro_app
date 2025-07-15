import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Canteiro = sequelize.define('Canteiro', {
  id_canteiro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_canteiro: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  x_canteiro: DataTypes.INTEGER,
  y_canteiro: DataTypes.INTEGER,
  plantas_canteiro: {
    type: DataTypes.JSON, // Armazena array de plantas
    allowNull: false
  }
}, {
  tableName: 'canteiro',
  timestamps: false
});

Canteiro.prototype.distribuirPlantas = function () {
  // Definindo o canteiro por estrato
  const canteiroDistribuido = {
    emergente: [],
    alto: [],
    medio: [],
    baixo: []
  };

  const canteiro_x = parseInt(this.x_canteiro, 10);
  const canteiro_y = parseInt(this.y_canteiro, 10);

  // Ordena as plantas por tempo de colheita (priorizando colheita mais rápida)
  const plantas_ordenadas = [...(this.plantas_canteiro.plantas || [])].sort(
    (a, b) => parseInt(a.tempo_colheita, 10) - parseInt(b.tempo_colheita, 10)
  );

  // Distribui as plantas nos estratos
  for (const planta of plantas_ordenadas) {
    const sombra = parseInt(planta.sombra, 10);
    const espacamento = parseInt(planta.espacamento, 10);
    const estrato = planta.estrato;

    // Calcula área disponível
    const area_disponivel = canteiro_x * canteiro_y;
    const estrato_disponivel = area_disponivel * (sombra / 100);
    const area_planta = espacamento ** 2;

    // Verifica se a planta cabe no espaço disponível
    if (area_planta > estrato_disponivel) continue;
    let num_plantas_possiveis = Math.floor(estrato_disponivel / area_planta);
    if (num_plantas_possiveis === 0) continue;

    let num_plantas_y = 1;
    let num_plantas_x = num_plantas_possiveis;
    let espacamento_x = Math.floor(canteiro_x / (num_plantas_x + 1));
    let espacamento_y = Math.floor(canteiro_y / (num_plantas_y + 1));

    while (espacamento_x < espacamento) {
      num_plantas_x = num_plantas_possiveis;
      if (espacamento_y < espacamento) continue;
      num_plantas_y += 1;
      num_plantas_x /= num_plantas_y;
      espacamento_x = Math.floor(canteiro_x / (num_plantas_x + 1));
      espacamento_y = Math.floor(canteiro_y / (num_plantas_y + 1));
    }
    num_plantas_x = Math.floor(num_plantas_x);
    num_plantas_y = Math.floor(num_plantas_y);
    let y = espacamento_y;

    for (let i = 0; i < num_plantas_y; i++) {
      let x = espacamento_x;
      for (let j = 0; j < num_plantas_x; j++) {
        canteiroDistribuido[estrato].push({
          nome_planta: planta.nome_planta,
          estrato: estrato,
          posicao: [x, y],
          diametro: espacamento,
          tempo_colheita: planta.tempo_colheita
        });
        x += espacamento_x;
      }
      y += espacamento_y;
    }
  }

  this.plantas_canteiro_destribuidas = canteiroDistribuido;
  return canteiroDistribuido;
};

export default Canteiro;