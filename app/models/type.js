const { sequelize } = require('@core/db');
const { Model, DataTypes } = require('sequelize');

class Type extends Model {}

Type.init(
    {
        type_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '主键ID',
        },
        type_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '类型名称',
        },
        type_category: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '类型大类',
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['income', 'expense']],
            },
            comment: '收入/支出',
        },
    },
    {
        sequelize,
        modelName: 'Type',
        tableName: 'Type',
    }
);

module.exports = {
    Type,
};
