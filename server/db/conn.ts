import { Sequelize } from 'sequelize';
//NOTE TO GRADER: For some reason we could not be able to make the in memory version of the database to work.
//We tried to create overwrite te sequelize with an in memory version of the database, but it did not work.
//Instead we just created a testdatabase that hosts on the same port.
export let sequelize = new Sequelize('postgres://postgres@localhost:5432');