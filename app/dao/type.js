const { Type } = require('@models/type');

class TypeDao {
    static async create(params) {
        const { type_name, type_category, category } = params;

        const type = new Type();
        type.type_name = type_name;
        type.type_category = type_category;
        type.category = category;

        try {
            const res = await type.save();

            const data = {
                type_name: res.type_name,
                type_category: res.type_category,
                category: res.category,
            };

            return [null, data];
        } catch (err) {
            return [err, null];
        }
    }

    static async bulkCreate(params) {
        try {
            const res = Type.bulkCreate(params);

            return [null, res];
        } catch (err) {
            return [err, null];
        }
    }
}

module.exports = {
    TypeDao,
};
