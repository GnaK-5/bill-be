const Router = require('koa-router');
const { TransactionDao } = require('@dao/transaction');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

const router = new Router({
    prefix: '/api/v1',
});

router.post('/createTransaction', async (ctx) => {
    const [err, data] = await TransactionDao.create(ctx.request.body);

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

router.post('/bulkCreateTransaction', async (ctx) => {
    const [err, data] = await TransactionDao.bulkCreate(ctx.request.body);

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

router.post('/getDateCount', async (ctx) => {
    const [err, data] = await TransactionDao.getDateCount();

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

router.post('/getTotal', async (ctx) => {
    const [err, data] = await TransactionDao.getTotal();

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

router.post('/getTypeTotal', async (ctx) => {
    const [err, data] = await TransactionDao.getTypeTotal();

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

module.exports = router;
