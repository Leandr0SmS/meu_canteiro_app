import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Estrato from './Estrato.js';

const Planta = sequelize.define('Planta', {
  id_planta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_planta: {
    type: DataTypes.STRING(140),
    unique: true,
    allowNull: false
  },
  tempo_colheita: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  espacamento: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estrato: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: Estrato,
      key: 'nome_estrato'
    }
  },
}, {
  tableName: 'planta',
  timestamps: false
});

// Define the relationship
Planta.belongsTo(Estrato, { foreignKey: 'estrato', targetKey: 'nome_estrato' });
Estrato.hasMany(Planta, { foreignKey: 'estrato', sourceKey: 'nome_estrato' });

export default Planta;