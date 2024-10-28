import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class Client extends Model {

    public id!: number;
    public name!: string;
    public contact!: string;
    public address!: string;
    public cpf_cnpj!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

}

Client.init(
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf_cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    },
    {
        sequelize,
        tableName: 'Clients',
    }
);