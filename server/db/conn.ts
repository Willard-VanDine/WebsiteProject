import { Sequelize } from 'sequelize';
export let sequelize = new Sequelize('postgres://postgres@localhost:5432');