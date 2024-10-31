"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Supplier_1 = __importDefault(require("./Supplier"));
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    imageURL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    supplierID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Supplier_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize: database_1.default,
    modelName: 'Product',
});
Product.belongsTo(Supplier_1.default, { foreignKey: 'supplierId', as: 'supplier' });
Supplier_1.default.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
exports.default = Product;
