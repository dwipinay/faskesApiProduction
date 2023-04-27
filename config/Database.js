import { Sequelize } from "sequelize"

export const databaseFKTP = new Sequelize(process.env.DB_DATABASE_FKTP, process.env.DB_USERNAME_FKTP, process.env.DB_PASSWORD_FKTP, {
    host: process.env.DB_HOST_FKTP,
    dialect: "mysql",
    define: {
        freezeTableName: true,
        timestamps: false
    },
    dialectOptions: {
        // useUTC: false
        connectTimeout: 60000
    },
    timezone: '+07:00', //for writing to database
    logging: console.log,
    pool: {
        max: 100,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
})

export const databaseFKRTL = new Sequelize(process.env.DB_DATABASE_FKRTL, process.env.DB_USERNAME_FKRTL, process.env.DB_PASSWORD_FKRTL, {
    host: process.env.DB_HOST_FKRTL,
    dialect: "mysql",
    define: {
        freezeTableName: true,
        timestamps: false
    },
    dialectOptions: {
        // useUTC: false
        connectTimeout: 60000
    },
    timezone: '+07:00', //for writing to database
    logging: console.log,
    pool: {
        max: 100,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
})
