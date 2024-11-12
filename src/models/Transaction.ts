import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';

class Transaction extends Model {
    public id!: number;
    public productId!: number;
    public quantity!: number;
    public transactionType!: 'entrada' | 'saida';
    public transactionDate!: Date;
    public orderId!: number;
}

Transaction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transactionType: {
        type: DataTypes.ENUM('entrada', 'saida'),
        allowNull: false,
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Transaction',
});

Transaction.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export default Transaction;