const { Transaction } = require('@models/transaction');
const { Type } = require('@models/type');
const { sequelize } = require('@core/db');

class TransactionDao {
    static async create(params) {
        const { amount, time, description, type_name } = params;

        const transaction = new Transaction();
        transaction.amount = amount;
        transaction.time = new Date(time);
        transaction.description = description;
        transaction.type_name = type_name;

        try {
            const res = await transaction.save();

            const data = {
                amount: res.amount,
                id: res.id,
            };

            return [null, data];
        } catch (err) {
            //   console.log(err);
            return [err, null];
        }
    }

    static async bulkCreate(params) {
        params.forEach((item) => {
            item.time = new Date(item.time);
        });
        try {
            const res = await Transaction.bulkCreate(params, { hooks: true });

            return [null, res];
        } catch (err) {
            return [err, null];
        }
    }

    static async getDateCount() {
        try {
            const res = await Transaction.findAll({
                attributes: [
                    // [sequelize.fn('YEARWEEK', sequelize.col('time')), 'week'],
                    // [sequelize.fn('YEAR', sequelize.col('time')), 'year'],
                    // [sequelize.fn('MONTH', sequelize.col('time')), 'month'],
                    [
                        sequelize.fn('SUM', sequelize.col('amount')),
                        'totalAmount',
                    ],
                ],
                // group: [
                //     sequelize.fn('YEAR', sequelize.col('time')),
                //     sequelize.fn('MONTH', sequelize.col('time')),
                // ],
                // order: [sequelize.fn('MONTH', sequelize.col('time'))],
            });
            // console.log(res);
            return [null, res];
        } catch (err) {
            return [err, null];
        }
    }

    static async getTotal() {
        try {
            const [total_expense] = await sequelize.query(`
                SELECT SUM(amount) AS total_expense
                FROM transaction
                WHERE type_name IN (
                    SELECT type_name FROM type WHERE category = 'expense'
                )
            `);
            const [total_detail] = await sequelize.query(`
                SELECT
                    year,
                    month,
                    total_income,
                    total_expense,
                    balance,
                    SUM(balance) OVER (ORDER BY year, month) AS total_balance
                FROM (
                    SELECT
                        YEAR(time) AS year,
                        MONTH(time) AS month,
                        SUM(CASE WHEN type.category = 'income' THEN amount ELSE 0 END) AS total_income,
                        SUM(CASE WHEN type.category = 'expense' THEN amount ELSE 0 END) AS total_expense,
                        SUM(CASE WHEN type.category = 'income' THEN amount ELSE -amount END) AS balance
                    FROM
                        transaction
                        JOIN type ON transaction.type_name = type.type_name
                    WHERE
                        type.category IN ('income', 'expense')
                    GROUP BY
                        YEAR(time),
                        MONTH(time)
                ORDER BY
                    YEAR(time),
                    MONTH(time)
                ) AS t
            `);
            const [total_income] = await sequelize.query(`
                SELECT SUM(amount) AS total_income
                FROM transaction
                WHERE type_name IN (
                    SELECT type_name FROM type WHERE category = 'income'
                )
            `);
            const [home] = await sequelize.query(`
                SELECT SUM(amount) AS total_home
                FROM transaction
                WHERE type_name = '家里支出'
            `);
            // console.log(total_income, total_expense);
            const balance =
                total_income[0].total_income - total_expense[0].total_expense;
            return [
                null,
                {
                    balance,
                    total_expense: parseInt(total_expense[0].total_expense),
                    total_income: parseInt(total_income[0].total_income),
                    home: parseInt(home[0].total_home),
                    total_detail,
                },
            ];
        } catch (err) {
            // console.log(err);
            return [err, null];
        }
    }

    static async getTypeTotal() {
        try {
            const [type_total] = await sequelize.query(`
                SELECT type_name, SUM(amount) AS type_total
                FROM transaction
                GROUP BY type_name
            `);
            return [null, type_total];
        } catch (err) {
            // console.log(err);
            return [err, null];
        }
    }
}

module.exports = {
    TransactionDao,
};
