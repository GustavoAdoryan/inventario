import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import OrderItem from './OrderItem';
import Client from './Client';
import Product from './Product';

class Order extends Model {
  public id!: number;
  public clientId!: number;
  public date!: Date;
  public status!: string;
  public totalAmount!: number;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Client, key: 'id' },

  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'Order',
});


Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems', onDelete: 'CASCADE' });
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });


OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export default Order;