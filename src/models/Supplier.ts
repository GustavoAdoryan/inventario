import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Supplier extends Model {
  public id!: number;
  public name!: string;
  public cnpj!: string;
  public contact!: string;
  public address!: string;
}

Supplier.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Supplier',
});

export default Supplier;