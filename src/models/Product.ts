import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Supplier from './Supplier';

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public stock!: number;
  public description!: string;
  public imageURL!: string;
  public supplierID!: string;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplierID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Supplier,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Product',
});

Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });


export default Product;