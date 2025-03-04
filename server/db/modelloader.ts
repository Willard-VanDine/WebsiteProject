import { AccountModel } from './accountmodel.db';
import { AccountStatsModel } from './accountStatsModel.db';
import { GamestateModel } from './gamestateModel.db';

// Set up associations after all models are defined
AccountModel.hasOne(AccountStatsModel, {
    foreignKey: 'username',
    onDelete: 'CASCADE',  // Cascade delete if AccountModel is deleted
});

AccountModel.hasOne(GamestateModel, {
    foreignKey: 'username',
    onDelete: 'CASCADE',  // Cascade delete if AccountModel is deleted
});

AccountStatsModel.belongsTo(AccountModel, {
    foreignKey: 'username',
    onDelete: 'CASCADE',  // Cascade delete if AccountModel is deleted
});

GamestateModel.belongsTo(AccountModel, {
    foreignKey: 'username',
    onDelete: 'CASCADE',  // Cascade delete if AccountModel is deleted
});

// Export models for use in other parts of the application
export { AccountModel, AccountStatsModel, GamestateModel };
