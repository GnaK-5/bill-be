const Router = require('koa-router');
const { TypeDao } = require('@dao/type.js');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

const router = new Router({
    prefix: '/api/v1',
});

router.post('/createType', async (ctx) => {
    const [err, data] = await TypeDao.create(ctx.request.body);

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

router.post('/bulkCreateType', async (ctx) => {
    const [err, data] = await TypeDao.bulkCreate(ctx.request.body);

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

router.post('/getType', async (ctx) => {
    const [err, data] = await TypeDao.getDateCount();

    if (!err) {
        // 返回结果
        ctx.response.status = 200;
        ctx.body = res.json(data);
    } else {
        ctx.body = res.fail(err);
    }
});

module.exports = router;
