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

export default Canteiro;