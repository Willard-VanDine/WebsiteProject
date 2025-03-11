import { Sequelize } from 'sequelize';
export let sequelize = new Sequelize('postgres://postgres@localhost:5432');

// Use in-memory database for testing
if (process.env.NODE_ENV === "test") {
    sequelize = new Sequelize({
        dialect: 'postgres',
        storage: ':memory:',
        username: 'postgres',
        password: '',
    });
}
