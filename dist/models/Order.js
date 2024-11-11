"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const OrderItem_1 = __importDefault(require("./OrderItem"));
const Client_1 = __importDefault(require("./Client"));
const Product_1 = __importDefault(require("./Product"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: Client_1.default, key: 'id' },
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Order',
});
Order.hasMany(OrderItem_1.default, { foreignKey: 'orderId', as: 'orderItems', onDelete: 'CASCADE' });
Order.belongsTo(Client_1.default, { foreignKey: 'clientId', as: 'client' });
OrderItem_1.default.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem_1.default.belongsTo(Product_1.default, { foreignKey: 'productId', as: 'product' });
exports.default = Order;
