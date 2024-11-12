"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Product_1 = __importDefault(require("./Product"));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    transactionType: {
        type: sequelize_1.DataTypes.ENUM('entrada', 'saida'),
        allowNull: false,
    },
    transactionDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Transaction',
});
Transaction.belongsTo(Product_1.default, { foreignKey: 'productId', as: 'product' });
exports.default = Transaction;
