import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
}, {
  tableName: 'planta',
  timestamps: false
});

export default Planta;