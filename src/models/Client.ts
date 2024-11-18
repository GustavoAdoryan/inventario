import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Client extends Model {
    public id!: number;
    public cpf_cnpj!: string;
    public contact!: string;
    public address!: string;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Client.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cpf_cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'Clients',
    }
);

Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Client, { foreignKey: 'userId', as: 'client' });

export default Client;
