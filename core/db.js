const Sequelize = require('sequelize');

const { dbName, host, port, user, password } =
    require('../config/config').database;

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: false,
    timezone: '+08:00',
    define: {
        // create_time && update_time
        timestamps: false,
        // delete_time
        paranoid: false,
        // 把驼峰命名转换为下划线
        underscored: true,
    },
});

// 创建模型
sequelize.sync({ force: false });

sequelize
    .authenticate()
    .then((res) => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    sequelize,
};
