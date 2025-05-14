import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Estrato = sequelize.define('Estrato', {
  nome_estrato: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  porcentagem_sombra: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'estrato',
  timestamps: false
});

export default Estrato;