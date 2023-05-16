const { sequelize } = require('@core/db');
const { Model, DataTypes } = require('sequelize');
const { Type } = require('@models/type');

class Transaction extends Model {}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '主键ID',
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            comment: '金额',
        },
        type_name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '类型ID',
        },
        time: {
            type: DataTypes.DATEONLY('YYYY-MM-DD'),
            allowNull: false,
            comment: '日期',
        },
        description: {
            type: DataTypes.STRING,
            comment: '说明',
        },
    },
    {
        sequelize,
        modelName: 'Transaction',
        tableName: 'Transaction',
    }
);

Transaction.beforeCreate(async (transaction, options) => {
    const type = await Type.findOne({
        where: { type_name: transaction.type_name },
        transaction: options.transaction,
    });
    // console.log(type);
    if (!type) {
        const error = new Error('type_name not found');
        error.name = 'TransactionCreateError';
        error.data = transaction;
        error.msg = 'type_name not found';
        throw error;
    }
    return transaction;
});

Transaction.beforeBulkCreate(async (transactions, options) => {
    const transactionsWithTypeId = await Promise.all(
        transactions.map(async (transaction) => {
            const type = await Type.findOne({
                where: { type_name: transaction.type_name },
                transaction: options.transaction,
            });
            if (!type) {
                const error = new Error('type_name not found');
                error.name = 'TransactionCreateError';
                error.data = transaction;
                error.msg = 'type_name not found';
                throw error;
            }
            transaction.TypeId = type.id;
            return transaction;
        })
    );
    options.individualHooks = true;
    return transactionsWithTypeId;
});

module.exports = {
    Transaction,
};
