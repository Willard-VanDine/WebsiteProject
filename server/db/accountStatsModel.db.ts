import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from './conn';
import { AccountModel } from './accountmodel.db';

export class AccountStatsModel extends Model<InferAttributes<AccountStatsModel>, InferCreationAttributes<AccountStatsModel>>{
    declare username: ForeignKey<AccountModel['username']>;
    declare accountWins: number;
    declare accountLosses: number;
    
}
AccountStatsModel.init(
    {
        username:{
            type: DataTypes.STRING,
            primaryKey:true
        },
       
        accountWins:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accountLosses:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
        {
            sequelize,
        

}
);